import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const IconGame: FunctionComponent = ({ name }): JSX.Element => {
  try {
    return (
      <img src={"/icons/" + name + ".png"} alt={name} className={styles.icon} />
    );
  } catch (e) {
    return <span>no icon</span>;
  }
};

export default IconGame;
