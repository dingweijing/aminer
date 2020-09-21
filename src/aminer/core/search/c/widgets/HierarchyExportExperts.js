/**
 * Created by yanmeiyang on 2018/4/10.
 */
import React, { Component } from 'react';
import { connect } from 'acore';
import { Auth } from 'acore/hoc';
import { sysconfig } from 'systems';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';
import { FM } from 'locales';
import * as personService from 'services/person/person';
import { getTwoDecimal, loadGoogleMap } from 'utils';
import * as bridge from 'utils/next-bridge';
import { loadExportExcel } from 'utils/requirejs';
import * as profileUtils from 'utils/profile-utils';
import hierarchy from 'helper/hierarchy';
import styles from './ExportExperts.less';

const CheckboxGroup = Checkbox.Group;

const plainOptions = [];

const originalBasicInfo = ['name', 'gender', 'pos', 'aff', 'nationality', 'email', 'homepage', 'interest'];
const originalStatistics = ['h_index', 'activity', 'new_star', 'num_citation', 'num_pubs'];
const originalClassification = ['classification'];

const defaultCheckedList = ['name', 'gender', 'pos', 'aff', 'nationalty', 'email', 'interest', 'h_index', 'activity', 'new_star', 'num_citation', 'num_pubs', 'classification']; // ['name', 'pos', 'aff', 'h_index'];

@connect(({ app, expertbaseTree }) => ({ app, expertbaseTree }))
@Auth
export default class HierarchyExportExperts extends Component {
  state = {
    loading: false,
    expanded: false, // 是否是展开状态
    modalVisible: false,
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
    exportSize: 100,
    maxExportSize: sysconfig.Enable_Export_size,
    interestsI18n: {},

    basicInfo: originalBasicInfo,
    statistics: originalStatistics,
    classification: originalClassification,

  };

  allNodeId = [];

  allNode = {};

  allChildren = [];

  needChild = false;


  componentDidMount() {
    personService.getInterestsI18N(result => {
      this.setState({ interestsI18n: result });
    });
    // this.setState({ exportSize: this.props.pageSize });
  }

  setExport = value => {
    this.setState({ expanded: !value });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  exportSearchResult = () => {
    this.setState({ modalVisible: true });
  };

  onChangeExportSize = e => {
    this.setState({ exportSize: e });
  };

  // 选择导出字段
  onChange = (type, checkedList) => {
    this.setState({ [type]: checkedList });
  };

  clickDownload = e => {
    this.setState({ loading: true });
    e.preventDefault();
    const { query, pageSize, current, filters, sort, expertbaseTree } = this.props;
    const offset = pageSize * (current - 1);
    const size = this.state.exportSize + offset;
    const { basicInfo, statistics, classification } = this.state;
    const selected = [...basicInfo, ...statistics, ...classification];
    // 获取右侧树的所有节点
    const { treeData } = expertbaseTree;
    if (treeData && treeData.length > 0) {
      this.matchData(treeData);
    }
    const currentEBId = filters && filters.eb && filters.eb.id ? filters.eb.id : '';
    const treeNode = this.allNode[currentEBId];
    this.allChildren = [];
    this.getCurrentNodeAllChildren(treeNode);
    this.featchDataAndDownload(size, offset, query, filters, sort, selected);
  };

  featchDataAndDownload = (newSize, newOffset, newQuery, newFilters, newSort, selected) => {
    // 这里控制着最大的循环次数（导出的最大人数，如果需要导出更多的人，需要改这里，目前最大4000人），
    const maxLoop = 40;
    const fetchData = (data, size, offset, i) => {
      const NewSize = Math.min(size - offset, 100);
      this.props.dispatch({
        type: 'search/searchPerson',
        payload: {
          query: newQuery,
          filters: newFilters,
          sort: newSort,
          size: NewSize,
          offset,
          ghost: true,
          expertBases: this.allNodeId,
          schema: [
            'id', 'name', 'name_zh', 'avatar', 'tags',
            { profile: ['position', 'affiliation', 'org', 'gender', 'bio', 'email', 'homepage', 'nation'] },
            { indices: ['hindex', 'pubs', 'citations', 'newStar', 'activity'] },
          ],
        },
      }).then(res => {
        // TODO res拼到data
        size = Math.min(res.total, size);
        if (res && res.result) {
          res = bridge.toNextPersons(res.result);
        } else if (res && res.items) {
          res = res.items;
        } else {
          console.log('Error');
        }
        if (offset + 100 < size && i < maxLoop) {
          fetchData(data.concat(res), size, offset + 100, i + 1);
        } else {
          this.exportData(data.concat(res), selected, newFilters);
        }
      });
    };
    const results = [];
    fetchData(results, newSize, newOffset, 0);
  };

  exportData = (res, selected, filters) => {
    selected.splice(1, 0, 'name_zh');
    const selectedItem = selected;
    let personInfo;
    if (res.length > 0) {
      personInfo = res.map(person => {
        const basic = {
          name: person.name,
          name_zh: person.name_zh,
          gender: (person.profile && person.profile.gender) ? personService.returnGender(person.profile.gender) : ' ',
          pos: (person.profile && person.profile.position) ? person.profile.position : '',
          aff: (person.profile && person.profile.affiliation) ? person.profile.affiliation : '',
          bio: (person.profile && person.profile.bio) ? person.profile.bio : '',
          nationality: (person.profile && person.profile.nation) ? person.profile.nation : '',
          email: (person.profile && person.profile.email) ? person.profile.email : '',
          homepage: (person.profile && person.profile.homepage) ? person.profile.homepage : '',
          h_index: person.indices.hindex ? person.indices.hindex : ' ',
          activity: person.indices.activity ? getTwoDecimal(parseFloat(person.indices.activity), 2) : ' ',
          new_star: person.indices.newStar ? getTwoDecimal(parseFloat(person.indices.newStar), 2) : ' ',
          num_citation: person.indices.citations ? getTwoDecimal(parseFloat(person.indices.citations), 2) : ' ',
          num_pubs: person.indices.pubs ? getTwoDecimal(parseFloat(person.indices.pubs), 2) : ' ',
          interest: (person.tags && person.tags.length > 0) ? person.tags.slice(0, 8).map(item => item).join('; ') : ' ',
          translate: (person.tags && person.tags.length > 0) ?
            person.tags.slice(0, 8).map(item => {
              const tag = personService.returnKeyByLanguage(this.state.interestsI18n, item);
              const showTag = tag.zh !== '' ? tag.zh : tag.en;
              return showTag;
            }).join(';') : ' ',
          classification: this.getEbNameByPersonHaves(person),
        };
        return basic;
      });
    }
    // 写入Excel 部分
    loadExportExcel(ExportJsonExcel => {
      const option = {};
      option.fileName = 'excel';
      option.datas = this.createSheet(personInfo, selectedItem, filters);
      const toExcel = new ExportJsonExcel(option); // new
      toExcel.saveExcel(); // 保存
    });

    this.setState({ loading: false, modalVisible: false });
  };

  createSheet = (data, selected, filters) => {
    const firstSelect = [...selected];
    const currentEBId = filters && filters.eb && filters.eb.id ? filters.eb.id : '';
    const treeNode = this.allNode[currentEBId];
    if (treeNode.childs) {
      this.allChildren.shift();
      const ebNameArray = this.allChildren;
      const firstSheet = {
        sheetData: data,
        sheetName: treeNode.name_zh || treeNode.name || '专家',
        sheetFilter: firstSelect,
        sheetHeader: firstSelect,
      };
      let allSheet;

      if (this.needChild) {
        ebNameArray.sort(this.sortNumber);
        const allData = {};
        ebNameArray.forEach((item) => {
          allData[item] = [];
          data.forEach((person) => {
            if (person.classification.includes(item)) {
              allData[item].push(person);
            }
          });
        });
        const sheet = Object.keys(allData).map((field) => {
          return {
            sheetData: allData[field],
            sheetName: field || '专家',
            sheetFilter: this.filter(selected),
            sheetHeader: selected,
          };
        });
        allSheet = [firstSheet, ...sheet];
      } else {
        allSheet = [firstSheet];
      }
      return allSheet;
    }
    const sheet = [
      {
        sheetData: data,
        sheetName: treeNode.name_zh || treeNode.name || '专家',
        sheetFilter: selected,
        sheetHeader: selected,

      },
    ];
    return sheet;

  };

  filter = selete => {
    if (selete.indexOf('classification') > 0) {
      selete.splice(selete.indexOf('classification'), 1);
    }
    return selete;
  };

  sortNumber = (a, b) => {
    // 暂时按照字母顺序排序。
    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }
    return a.localeCompare(b);
  };

  getEbNameByPersonHaves = person => {
    if (person.dims && person.dims.eb && person.dims.eb.length > 0) {
      const { expertbaseTree } = this.props;
      const data = hierarchy.findInfoByEBId(expertbaseTree.treeData, expertbaseTree.treeIndex, person.dims.eb, ['name']);
      let ebNameStr = '';
      if (data && data.length > 0) {
        data.forEach(ebs => {
          const name = ebs.name_zh || ebs.name || '';
          ebNameStr += `${name}; `;
        });
      }
      return ebNameStr;
    } else {
      return '';
    }
  };

  getCurrentNodeAllChildren = data => {
    const name = data.name_zh || data.name || '';
    this.allChildren.push(name);
    if (data.childs) {
      data.childs.forEach(child => {
        this.getCurrentNodeAllChildren(child);
      });
    }
  };

  // 左侧树的所有id
  matchData = items => {
    items.forEach(item => {
      this.allNodeId.push(item.id);
      this.allNode[item.id] = item;
      if (item.childs) {
        item.childs.forEach(child => {
          this.matchData([child]);
        });
      }
    });
  };

  changeNeedChildrenEB = e => {
    this.needChild = e.target.checked;
  };

  render() {
    const { expanded, modalVisible, basicInfo, statistics, classification } = this.state;
    const { expertBaseId } = this.props;
    return (
      <div className={styles.exportExperts}>
        <Button
          className={styles.exportButton}
          onClick={this.exportSearchResult.bind()}>
          <FM id="com.exportExpert.label.export" defaultMessage="导出" />
        </Button>

        {/* ---- Modal Zone ---- */}

        <Modal
          title={<FM id="com.exportExpert.modal.exportExperts" defaultMessage="导出专家列表" />}
          visible={modalVisible}
          footer={null}
          onCancel={this.hideModal.bind(this)}
          width={640}
          style={{ height: 300 }}>

          <label className={styles.exportNumLabel} htmlFor="">
            <FM id="com.exportExpert.modal.exportNumber" defaultMessage="导出条数:" />
          </label>
          <InputNumber min={1} max={this.state.maxExportSize}
            defaultValue={this.state.exportSize}
            onChange={this.onChangeExportSize.bind(this)} />
          <Checkbox value={this.needChild} className={styles.needChildren}
            onClick={this.changeNeedChildrenEB}>
            是否导出子智库
          </Checkbox>

          <div className={styles.fields}>
            <FM id="com.exportExpert.modal.exportBasicInfo" defaultMessage="Basic Info:" />
          </div>
          <CheckboxGroup
            value={this.state.basicInfo} onChange={this.onChange.bind(this, 'basicInfo')}>
            <Row style={{ paddingLeft: 20 }}>
              {originalBasicInfo.map(item => (
                <Col span={8} key={item}>
                  <Checkbox value={item}>
                    <FM id={`com.exportExpert.fields.${item}`} defaultMessage={item} />
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </CheckboxGroup>

          <div className={styles.fields}>
            <FM id="com.exportExpert.modal.exportStatistics" defaultMessage="Statistics:" />
          </div>
          <CheckboxGroup
            value={this.state.statistics} onChange={this.onChange.bind(this, 'statistics')}>
            <Row style={{ paddingLeft: 20 }}>
              {originalStatistics.map(item => (
                <Col span={8} key={item}>
                  <Checkbox value={item}>
                    <FM id={`com.exportExpert.fields.${item}`} defaultMessage={item} />
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </CheckboxGroup>

          <div className={styles.fields}>
            <FM id="com.exportExpert.modal.exportClassification"
              defaultMessage="Classification:" />
          </div>
          <CheckboxGroup
            value={this.state.classification}
            onChange={this.onChange.bind(this, 'classification')}>
            <Row style={{ paddingLeft: 20 }}>
              {originalClassification.map(item => (
                <Col key={item}>
                  <Checkbox value={item}>
                    <FM id={`com.exportExpert.fields.${item}`} defaultMessage={item} />
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </CheckboxGroup>

          <div style={{ height: 20 }}>
            <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
              loading={this.state.loading}>
              <a onClick={this.clickDownload.bind(this)} download="data.csv" href="#">
                <FM id="com.exportExpert.modal.export" defaultMessage="导出" />
              </a>
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
