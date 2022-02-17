import styles from "./Map.module.scss";

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

  return <>{tiles_html}</>;
};

export default MapPlaceholder;
