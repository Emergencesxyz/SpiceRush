import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

interface Props {
  name: string;
  size?: string;
}

const IconGame: FunctionComponent<Props> = ({ name, size }): JSX.Element => {
  try {
    return (
      <img
        src={"/icons/" + name + ".png"}
        alt={name}
        className={styles.icon}
        style={{ maxWidth: size ? size : "25px" }}
      />
    );
  } catch (e) {
    return <span>no icon</span>;
  }
};

export default IconGame;
