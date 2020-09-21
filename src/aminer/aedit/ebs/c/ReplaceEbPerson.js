import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import PersonList from 'aminer/components/expert/PersonList.tsx';
import { component, connect } from 'acore';

const ReplaceEbPerson = props => {
    const { dispatch, person, ebId } = props;

    useEffect(() => {
        console.log('ReplaceEbPerson', person.name);
        dispatch({
            type: 'editEb/getEbReplacePerson',
            payload: {
                query: { query: person.name },
                filter: {},
                smartQuery: {}
            }
        })
    }, [])

    const replacePerson = (newId) => {
        dispatch({
            type: 'editEb/replaceEbPerson',
            payload: {
                "ebId": ebId,
                "oldPersonId": person.id,
                "newPersonId": newId,
                "dim1": "eb",
                "system": "aminer"
            }
        })
    }

    const rightZone = [
        ({ person }) => {
            return (
                <Button type='primary' onClick={replacePerson.bind(this, person.id)}>替换</Button>
            )
        }
    ]

    return (
        <div style={{ padding: '16px' }}>
            <PersonList
                id="aminerPersonList"
                target="_blank"
                mode='v3'
                followSize="small"
                persons={persons}
                rightZone={rightZone}
            />
        </div>
    )
}

export default component(connect())(ReplaceEbPerson)


const persons = [{
    "avatar": "https://static.aminer.org/upload/avatar/156/1610/268/53f459cfdabfaeecd69f7fc0.png",
    "id": "53f459cfdabfaeecd69f7fc0",
    "indices": {
        "activity": 14.5318,
        "citations": 841,
        "diversity": 2.8323,
        "gindex": 28,
        "hindex": 9,
        "newStar": 1.1825,
        "pubs": 52,
        "risingStar": 1.1825,
        "sociability": 3.9702
    },
    "name": "Claudio Schifanella",
    "name_zh": "",
    "profile": {
        "affiliation": "Università di Torino, Torino, Italy",
        // "gender": "male",
        "lang": "english",
        "org": "Università di Torino, Torino, Italy"
    },
    "score": 0,
    "sourcetype": "person",
    "tags": [
        "Web Service",
        "Social Network",
        "Semantic Web",
        "Social Networks",
        "Visualization",
        "Data Visualization",
        "Italian Tv Talk Show",
        "Satisfiability",
        "History",
        "Word Frequency",
        "Text Analysis",
        "Real Time",
        "Social Media Platform",
        "Scientific Career",
        "Kbc Model",
        "Novel Term",
        "Co-clustering · Metadata · Constraints · Context-aware Clustering · Concept Alignment",
        "Individual Agent",
        "User Generated Content",
        "Capabilities"
    ]
}]