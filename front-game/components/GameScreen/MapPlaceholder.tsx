import styles from "./GameScreenC.module.scss";

import { Container, Row, Placeholder } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

interface Props {
  length: Number;
}

const MapPlaceholder: FunctionComponent<Props> = ({ length }): JSX.Element => {
  let tiles_html = [];
  for (let i = 0; i < length; i++) {
    tiles_html.push(
      <Placeholder key={i} as="p" animation={i < 3 ? "glow" : "wave"}>
        {" "}
        <Placeholder xs={12} className={styles.placeholder} />{" "}
      </Placeholder>
    );
  }

  return (
    <>
      <div className={styles.map}>{tiles_html}</div>
    </>
  );
};

export default MapPlaceholder;
