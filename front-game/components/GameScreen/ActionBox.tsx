import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ActionBox: FunctionComponent = ({ tiles, character }): JSX.Element => {
  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div>
          <ArrowForwardIosIcon />
        </div>
      </div>
    </>
  );
};

export default ActionBox;
