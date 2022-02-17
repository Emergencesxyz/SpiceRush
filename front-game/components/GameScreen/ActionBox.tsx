import styles from "./GameScreen.module.scss";

import { Row, Button, Col } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import IconGame from "./IconGame";

const ActionBox: FunctionComponent = ({ tiles, character }): JSX.Element => {
  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div className={styles.actionBoxRow}>
          <Button>up</Button>
          <Row>
            <Col>
              <Button>left</Button>
            </Col>

            <Col>
              <Button>right</Button>
            </Col>
          </Row>

          <Button>down</Button>
        </div>

        <div className={styles.actionBoxRow}>
          <Button className={styles.actionBoxButton}>
            <IconGame name="mining" />
            Mine
          </Button>
          <Button>
            <IconGame name="rest2" /> Rest
          </Button>
        </div>
      </div>
    </>
  );
};

export default ActionBox;
