import styles from "./GameScreen.module.scss";

import { Container, Row, Placeholder } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const MapPlaceholder: FunctionComponent = ({ length }): JSX.Element => {
  let tiles_html = [];
  for (let i = 0; i < length; i++) {
    tiles_html.push(
      <Placeholder as="p" animation={i < 3 ? "glow" : "wave"}>
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
