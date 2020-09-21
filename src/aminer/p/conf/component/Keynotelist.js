import React, { useState, useEffect } from 'react';
import { connect, Link, P, component } from 'acore';

import { Hole } from 'components/core';
import styles from './Keynotelist.less';

const defaultZones = {
  authorsZone: [
    ({ authors }) => (
      <>
        {authors && !!authors.length && (
          <p className="authors">
            {authors.map((author, index) => {
              const { name } = author;
              return (
                <>
                  <span className="author">{name}</span>
                  {index !== authors.length - 1 && <span>, </span>}
                </>
              );
            })}
          </p>
        )}
      </>
    ),
  ],
};

const KeynoteList = props => {
  const { keynotes, authorsZone } = props;

  return (
    <ul className={styles.keynotesComponent}>
      {keynotes &&
        keynotes.length > 0 &&
        keynotes.map(keynote => {
          const { date, authors, title, link } = keynote;
          return (
            <li className="keynote_item" key={title}>
              {date && <p className="date">{date}</p>}
              <p className="title">
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {title}
                  </a>
                )}
                {!link && <span>{title}</span>}
              </p>

              <Hole
                name="PaperList.contentLeftZone"
                fill={authorsZone}
                defaults={defaultZones.authorsZone}
                param={{ authors }}
                config={{ containerClass: 'authors-zone' }}
              />
            </li>
          );
        })}
    </ul>
  );
};

export default component(connect())(KeynoteList);
