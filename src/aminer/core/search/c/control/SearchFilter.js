import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import { FM } from 'locales';
import { classnames } from 'utils';
import { Tag } from 'antd';
import { sysconfig } from 'systems';
import styles from './SearchFilter.less';

const sample_expertbases = [
  {
    id: '55ebd8b945cea17ff0c53d5a',
    name: '中国科学院院士',
    nperson: 287,
  },
]
if (sample_expertbases) {/* */ }

// 这里先写全所有的filters，靠返回值的aggregation中有无相应结果来控制是否显示。
const default_keys = ['h_index', 'gender', 'nation', 'lang', 'dims.systag'];

/**
 * SearchFilter Component
 */
@connect(({ auth }) => ({ roles: auth.roles }))
class SearchFilter extends PureComponent {

  static propTypes = {
    filters: PropTypes.object.isRequired,
    expertbases: PropTypes.array,
    disableExpertBaseFilter: PropTypes.bool,

    onFilterChange: PropTypes.func,
  };

  onFilterChange = (name, term, checked, count) => {
    const { onFilterChange } = this.props;
    if (onFilterChange) {
      onFilterChange(name, term, checked, count);
    }
  }
  // constructor(props) {
  //   super(props);
  // }

  // shouldComponentUpdate(nextProps) {
  //   if (compareDeep(nextProps, this.props, 'filters')) {
  //     return false;
  //   }
  //   if (compareDeep(nextProps, this.props, 'aggs')) {
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    const { filters, aggs, disableExpertBaseFilter, roles, expertbases, className } = this.props;
    const keys = default_keys;

    const { onExpertBaseChange } = this.props;
    // console.log(">>>>>>>>>>>>>>>>>>>>>================ filters: ", expertbases, disableExpertBaseFilter)
    // const expertBases = ExpertBases || sysconfig.ExpertBases;


    // let expertRating;
    // // TODO ccfemergency
    // if (roles && (roles.god || roles.admin)) {
    //   expertRating = true;
    // } else if (roles && roles.role[0] && roles.role[0].includes('超级管理员')) {
    //   expertRating = true;
    // } else {
    //   expertRating = false;
    // }

    return (
      <div className={classnames(styles.searchFilter, styles[className])}>
        <div className={styles.filter}>

          {/* ------ 过滤条件 ------ */}

          {filters && Object.keys(filters).length > 0 && (
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}>
                <FM id="com.search.filter.Filters" defaultMessage="Filters:" />
              </span>
              <ul className={styles.filterItems}>
                {Object.keys(filters).map((key) => {
                  const newFilters = key === 'eb' ? filters[key] : filters[key].split('#')[1];
                  // TODO 上线nec的时候需要把这里放开，就不会显示全球专家了
                  // if (newFilters && newFilters.id === 'aminer') {
                  //   return null;
                  // }
                  return (
                    <Tag key={key} className={styles.filterItem} closable={key !== 'eb'}
                      onClose={() => this.onFilterChange(key, newFilters, false)}
                      color="geekblue">
                      {key === 'eb' && filters[key].name}
                      {key !== 'eb' && (
                        <span>
                          <FM id={`com.search.filter.label.${key}`} defaultMessage={key} />
                          : {filters[key].split('#')[0]}
                        </span>
                      )}
                    </Tag>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ------ 搜索范围 / Expert Base ------ */}

          {!disableExpertBaseFilter && expertbases && expertbases.length > 0 && (
            <div className={classnames(styles.filterRow, styles.range)}>
              <span className={styles.filterTitle}>
                <FM id="com.search.filter.searchRange" defaultMessage="Search Range:" />
              </span>
              <ul className={styles.filterItems}>
                {expertbases.map((eb) => {
                  let isShowEb = false;
                  // TODO ccfemergency 此处鉴别方式需要修改
                  // if ((eb.id === 'aminer' &&
                  //   (sysconfig.SYSTEM === 'ccf' || sysconfig.SYSTEM === 'ccftest') &&
                  //   !expertRating)) {
                  //   isShowEb = true;
                  // }
                  if (eb.show) {
                    isShowEb = !eb.show(roles && roles.role);
                  }
                  const ebidInFilter = filters && filters.eb && filters.eb.id; // TODO multi eb select
                  const props = {
                    key: eb.id,
                    className: styles.filterItem,
                    onChange: () => this.onFilterChange('eb', { id: eb.id, ebids: eb.ebids, name: eb.name }, true),
                    checked: (ebidInFilter && ebidInFilter === eb.id) || (!ebidInFilter && eb.id === 'aminer'),
                    style: { display: isShowEb ? 'none' : 'block' },
                  };
                  return (
                    <Tag.CheckableTag {...props}>
                      {eb.name}
                    </Tag.CheckableTag>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ------ 其他 Filter ------ */}

          {keys && keys.length > 0 && aggs && keys.map((key, index) => {
            const aggss = aggs.filter(a => (a.name === key));
            const agg = aggss && aggss.length > 0 && aggss[0];
            const aggcfg = AggConfig[key];
            // console.log('>>__++__+_+:::::', key, aggcfg, agg);
            if (!agg // invalid
              || (agg.name === sysconfig.SearchFilterExclude) // TODO old skipper
              || filters[agg.name] // filter out already selected.
              || !agg.items || agg.items.length === 0 // if agg is empty
            ) {
              return false;
            }

            return (
              <div key={agg.name} className={classnames(
                styles.filterRow, styles.range,
                (index === aggs.length - 1) ? 'last' : '',
              )}>
                <span className={styles.filterTitle}>
                  <FM id={`com.search.filter.label2.${agg.name}`} defaultMessage={agg.name} />:
                </span>
                <ul>
                  {agg.items.slice(0, 12).map((item) => {
                    const termLabel = aggcfg.render ? aggcfg.render(item) : item.term;

                    if (!termLabel) {
                      return false;
                    }
                    const onChange = checked =>
                      this.onFilterChange(agg.name, item.term, checked, item.count);

                    const itemKey = `${agg.name}.${item.term}`;
                    return (
                      <Tag.CheckableTag
                        key={itemKey}
                        className={classnames(styles.filterItem, 'label')}
                        checked={filters[agg.name] === item.term}
                        onChange={onChange}
                      >
                        {termLabel}
                        <span style={{ padding: '0 2px' }}>
                          (
                          <span className={classnames(styles.filterCount, 'label-count')}>
                            {item.count > 1000 ? `${Math.floor(item.count / 1000)}k` : item.count}
                          </span>
                          )
                        </span>
                      </Tag.CheckableTag>
                    );
                  })}
                </ul>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
}

// aggregation config， 使用最新的来用。
const AggConfig = {
  gender: {
    render: (item) => {
      const lowerName = item.term.toLowerCase();
      if (lowerName === 'no_records' || lowerName === 'both') {
        return false;
      }
      return item.term ? (
        <FM id={`com.search.filter.value.gender.${item.term}`} defaultMessage={item.term} />
      ) : false;
    },
  },
  h_index: {
    render: (item) => {
      if (!item) {
        return false;
      }
      if (!item.from && item.to) {
        return `<${item.to}`;
      } else if (item.from && !item.to) {
        return `>=${item.from}`;
      } else if (item.from && item.to) {
        return `${item.from}-${item.to}`;
      }
      return item.term;
    },
  },
  nation: {},
  lang: {},
  'dims.systag': {}, // first used in bole's tag system.
};

export default SearchFilter;
