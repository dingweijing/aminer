import React, { useState } from 'react';
import { Menu, Switch, message, Select, Dropdown, Tag, Popconfirm } from 'antd';
import { component, connect } from 'acore';
import { FM } from 'locales';
import { personLangArray } from 'helper/profile';
import ReplaceEbPerson from './ReplaceEbPerson';
import styles from './EditGenderLang.less';

const EditGenderLang = props => {
    const { person, dispatch, ebId } = props;
    const { profile = {}, id } = person || {};

    const [gender, setGender] = useState(profile.gender);
    const [lang, setLang] = useState(profile.lang);

    const updateGender = (v) => {
        v = v ? 'male' : 'female';
        updateField('gender', v);
    }

    const updateLang = (v) => {
        updateField('language', v);
    }

    const updateField = (fieldName, v) => {
        dispatch({
            type: 'editProfile/UpsertPersonAnnotation',
            payload: {
                id,
                force_update: true,
                fields: [{
                    field: fieldName,
                    value: v
                }],
            },
        }).then(data => {
            if (data) {
                if (fieldName === 'gender') {
                    setGender(v)
                } else {
                    setLang(v);
                }
            } else {
                message.error('error')
            }
        }).catch((err) => {
            message.error('error')
        })
    };

    const openReplace = () => {
        console.log('openReplace', person.name, person.name_zh);
        dispatch({
            type: 'modal/open',
            payload: {
                title: `替换 ${person.name_zh} (${person.name})`,
                content: <ReplaceEbPerson ebId={ebId} person={person} />
            }
        })
    }


    const menu = (
        <Menu>
            <Menu.Item>
                <span onClick={openReplace}>替换</span>
            </Menu.Item>
            <Menu.Item>
                <Popconfirm
                    title="确认删除 ?"
                    onConfirm={() => { }}
                    okText="是"
                    cancelText="否"
                >
                    删除
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );


    return (
        <div className={styles.editGenderLang}>
            <Switch
                size="small"
                checked={gender === 'male' || !gender}
                checkedChildren="Male"
                onChange={updateGender}
                unCheckedChildren="Female"
            />
            <Select
                value={lang}
                size='small'
                onChange={updateLang}
                className={styles.selectLang}
            >
                {personLangArray && personLangArray.map(({ name, value }) => {
                    return (
                        <Select.Option className="langItem" value={value} key={name}>
                            {name}
                        </Select.Option>
                    )
                })}
            </Select>
            <Dropdown overlay={menu}>
                <Tag className={styles.action}>
                    <FM id="aminer.nav.action.start" defaultMessage="操作" />
                    <svg className="icon" aria-hidden="true" >
                        <use xlinkHref="#icon-shouqi" />
                    </svg>
                </Tag>
            </Dropdown>
        </div>
    )
}

export default component(connect())(EditGenderLang)