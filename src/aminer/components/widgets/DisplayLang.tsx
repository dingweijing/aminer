import React, { useRef, useState } from "react";
import { component } from "acore";
import { IntlContext, FormattedMessage } from "umi";
import { Modal } from "antd";
import { classnames } from "utils";
import styles from "./DisplayLang.less";

interface IPropTypes {
  en: string | React.ReactNode;
  zh: string | React.ReactNode;
}

const DisplayLang: React.FC<IPropTypes> = (props) => {
  const { en, zh } = props;

  return (
    <IntlContext.Consumer>
      {(intl): React.ReactNode => {
        console.log("intl", intl);
        console.log("isValidElement", React.isValidElement(zh));
        if (typeof en === "string" || typeof zh === "string") {
          return intl.locale === "en-US" ? en || "" : zh || "";
        }
        if (React.isValidElement(zh) || React.isValidElement(en)) {
          return (
            <div className={classnames(styles.displayLang)}>
              {intl.locale === "en-US" && (en || <></>)}
              {intl.locale === "zh-CN" && (zh || <></>)}
            </div>
          );
        }
      }}
    </IntlContext.Consumer>
  );
};

export default component()(DisplayLang);
