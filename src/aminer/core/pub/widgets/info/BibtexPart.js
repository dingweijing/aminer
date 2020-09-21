import React from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import PropTypes from 'prop-types';
import { Bibtex } from 'aminer/core/pub/widgets';
import styles from './BibtexPart.less';

const BibtexPart = props => {
  const { paper, dispatch } = props;

  const bibtex = id => {
    // dispatch({ type: 'aminerSearch/bibtex', payload: { id } })
    //   .then(data => {
    //     if (data.status) {
    //       console.log('data', data.data)
    //       dispatch({
    //         type: 'modal/open',
    //         payload: {
    //           title: formatMessage({ id: 'aminer.paper.bibtex', defaultMessage: 'Bibtex' }),
    //           content: <Bibtex bibtex={data.data} />
    //         }
    //       })
    //     }
    //   })
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.paper.bibtex', defaultMessage: 'Bibtex' }),
        content: <Bibtex id={id} />,
      },
    });
  };

  return (
    <span
      className={classnames(styles.bibtex, 'bibtex')}
      onClick={() => {
        bibtex(paper.id);
      }}
    >
      {/* <i className='fa fa-book' /> */}
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-yin" />
      </svg>
      <FM id="aminer.paper.bibtex" defaultMessage="Bibtex" />
    </span>
  );
};

BibtexPart.propTypes = {
  paper: PropTypes.object.isRequired,
};

export default component(connect())(BibtexPart);
