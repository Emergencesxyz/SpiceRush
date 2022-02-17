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

    let audio = new Audio("./sounds/button_scifi.mp3");
    audio.play();

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

  const spawn = async (e) => {
    return await blockchainService.spawn("0", library);
  };

  const { energy, hp, mining } = character ? character.stats : {};

  const blocked = !(energy && hp);
  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div className={styles.actionBoxRow}>
          <Button
            onClick={blocked ? undefined : moveCharacter}
            name="up"
            className={blocked ? styles.disabled : ""}
            title={blocked ? "no more hp nor energy, please rest :(" : ""}
          >
            <ArrowCircleUpIcon color="primary" />
          </Button>
          <Row>
            <Col>
              <Button
                onClick={blocked ? undefined : moveCharacter}
                name="left"
                className={blocked ? styles.disabled : ""}
                title={blocked ? "no more hp nor energy, please rest :(" : ""}
              >
                <ArrowCircleLeftIcon color="primary" />
              </Button>
            </Col>

            <Col>
              <Button
                onClick={blocked ? undefined : moveCharacter}
                name="right"
                className={blocked ? styles.disabled : ""}
                title={blocked ? "no more hp nor energy, please rest :(" : ""}
              >
                <ArrowCircleRightIcon color="primary" />
              </Button>
            </Col>
          </Row>

          <Button
            onClick={blocked ? undefined : moveCharacter}
            name="down"
            className={blocked ? styles.disabled : ""}
            title={blocked ? "no more hp nor energy, please rest :(" : ""}
          >
            <ArrowDropDownCircleIcon color="primary" />
          </Button>
        </div>

        <div className={styles.actionBoxRow}>
          <Button
            className={blocked ? styles.disabled : ""}
            title={blocked ? "no more hp nor energy, please rest :(" : ""}
          >
            <IconGame name="mining" size="20px" />
            Mine
          </Button>
          <Button
            className={!hp ? styles.disabled : ""}
            title={blocked ? "no more hp  :(" : ""}
          >
            <IconGame name="rest2" size="20px" /> Rest
          </Button>

          {!hp && (
            <Button onClick={spawn}>
              <IconGame name="skull" size="20px" /> Spawn
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ActionBox;
