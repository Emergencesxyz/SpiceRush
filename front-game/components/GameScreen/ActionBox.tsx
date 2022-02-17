import styles from "./GameScreen.module.scss";

import { Row, Button, Col } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import IconGame from "./IconGame";

const ActionBox: FunctionComponent = ({ tiles, character }): JSX.Element => {
  const { account, library } = useWeb3React();
  const blockchainService = new BlockchainService(account);

  const moveCharacter = async (e) => {
    let x, y: number;

    if (e.target.name === "right") {
      x = character.x;
      y = character.y + 1;
    } else if (e.target.name === "left") {
      x = character.x;
      y = character.y - 1;
    } else if (e.target.name === "up") {
      x = character.x - 1;
      y = character.y;
    } else if (e.target.name === "down") {
      x = character.x + 1;
      y = character.y;
    } else return;

    console.log("(x,y)", x, y);
    return await blockchainService.moveCharacter(x, y, library);
  };

  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div className={styles.actionBoxRow}>
          <Button onClick={moveCharacter} name="up">
            <ArrowCircleUpIcon color="primary" />
          </Button>
          <Row>
            <Col>
              <Button onClick={moveCharacter} name="left">
                <ArrowCircleLeftIcon color="primary" />
              </Button>
            </Col>

            <Col>
              <Button onClick={moveCharacter} name="right">
                <ArrowCircleRightIcon color="primary" />
              </Button>
            </Col>
          </Row>

          <Button onClick={moveCharacter} name="down">
            <ArrowDropDownCircleIcon color="primary" />
          </Button>
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
