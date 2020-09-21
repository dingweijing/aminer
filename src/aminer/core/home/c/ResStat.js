import React, { useState, useEffect, useRef } from 'react';
import { connect, component } from 'acore';
import { FM } from 'locales';
import { classnames } from 'utils';
import cache from 'helper/cache';
import styles from './ResStat.less';

/**
 * Refactor by BoGao 2019-06-10
 * AMiner Homepage
 *   2019-06-10 - to hooks
 */

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
const getDelta = (duration, total_value, curTime) => {
  const noise = Math.max(primes.map(p => Math.cos(curTime / p + p)).reduce((a, b) => a + b), 0);

  const true_delta = total_value * (curTime / duration);
  // console.log(noise, true_delta)
  return Math.floor(noise * (total_value / duration) + true_delta);
}

const personIncrement = 20000000;
const pubIncrement = 80000000;

const ResStat = props => {
  const [nstats, setNstats] = useState({
    nresearchers: 130592407,
    npublications: 185544544,
    nconcepts: 8795849,
    ncitations: 754201878
  })

  const timer = useRef();
  const destroy = useRef(false);


  const calcTime = (history, last) => {
    const startTime = new Date(history)
    const endTime = new Date(last)

    // while (+new Date(endTime) < +new Date()) {
    //   startTime.setDate(startTime.getDate() + 20)
    //   endTime.setDate(endTime.getDate() + 20)
    // }

    return {
      startTime: +new Date(startTime),
      endTime: +new Date(endTime),
      duration: +new Date(endTime) - +new Date(startTime)
    }
  }

  const getLastNum = (history, last) => {
    const researchers = last.person_count - history.person_count;
    const publications = last.paper_count - history.paper_count;
    const concepts = last.topic_count - history.topic_count;
    const citations = last.citation_count - history.citation_count;

    const { duration, endTime } = calcTime(history.time, last.time)

    return {
      researchers: researchers > 0
        ? getDelta(duration, researchers, +new Date() - endTime)
        + history.person_count
        : history.person_count,
      publications: publications > 0
        ? getDelta(duration, publications, +new Date() - endTime)
        + history.paper_count
        : history.paper_count,
      concepts: concepts > 0
        ? getDelta(duration, concepts, +new Date() - endTime)
        + history.topic_count
        : history.topic_count,
      citations: citations > 0
        ? getDelta(duration, citations, +new Date() - endTime)
        + history.citation_count
        : history.citation_count
    }
  }

  const getStats = stats => {
    timer.current = setTimeout(() => {
      getStats(stats)
    }, Math.random() * 700 + 1300)
    const lastNumbers = getLastNum(stats.history, stats.last)
    setNstats({
      nresearchers: lastNumbers.researchers + personIncrement,
      npublications: lastNumbers.publications + pubIncrement,
      nconcepts: lastNumbers.concepts,
      ncitations: lastNumbers.citations,
    })
  }

  useEffect(() => {
    destroy.current = false;
    const { dispatch } = props;
    dispatch({ type: 'roster/getNewStats' })
      .then(stats => {
        if (!destroy.current) {
          getStats(stats)
        }
      })
      .catch(err => {
        console.log('ERROR.....112233 ', err);
      });

    return () => {
      destroy.current = true
      clearTimeout(timer.current)
    }
  }, []);

  return (
    <div className={styles.statItems}>
      <div className="statItem">
        <div className="svg">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-researchers" />
          </svg>
        </div>
        {/* <p>130,614,292</p> */}
        <span className="split" />
        <div className="statistic">
          <p>{nstats.nresearchers.toLocaleString() || ' '}</p>
          <FM id="aminer.home.statistics.researchers" />
        </div>
      </div>

      <div className="statItem">
        <div className="svg">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-publications" />
          </svg>
        </div>
        <span className="split" />
        {/* <p>233,127,915</p> */}
        <div className="statistic">
          <p>{nstats.npublications.toLocaleString() || ' '}</p>
          <FM id="aminer.home.statistics.publications" />
        </div>
      </div>

      <div className="statItem">
        <div className="svg">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-concepts" />
          </svg>
        </div>
        <span className="split" />
        <div className="statistic">
          <p>{nstats.nconcepts.toLocaleString() || ' '}</p>
          <FM id="aminer.home.statistics.concepts" />
        </div>
      </div>
      <div className="statItem">
        <div className="svg">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-last" />
          </svg>
        </div>
        <span className="split" />
        <div className="statistic">
          <p>{nstats.ncitations.toLocaleString() || ' '}</p>
          <FM id="aminer.home.statistics.citations" />
        </div>
      </div>
    </div>
  )
}

export default component(connect())(ResStat)
