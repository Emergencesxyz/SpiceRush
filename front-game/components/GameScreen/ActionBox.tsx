import styles from "./GameScreen.module.scss";

import { Row, Button, Col } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import IconGame from "./IconGame";

const ActionBox: FunctionComponent = ({
  character,
  actions,
  setActions,
  characterId,
  setLoading,
}): JSX.Element => {
  const { account, library } = useWeb3React();
  const [sounds, setSounds] = useState<Object | null>(null);

  const blockchainService = new BlockchainService(account, null, null);

  const moveCharacter = async (e) => {
    let x, y: number;
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();

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
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();
    return await blockchainService.spawn(characterId, library);
  };

  const rest = async (e) => {
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();
    return await blockchainService.rest(0, 1, library);
  };

  const mine = async (e) => {
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();
    await blockchainService.mine(0, 1, library);

    return;
  };

  const refresh = async (e) => {
    console.log("mine actions", actions);
    setActions(actions++);
  };
  const { energy, hp, mining } = character ? character.stats : {};

  const blocked = !(energy && hp);
  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div className={styles.actionBoxRow}>
          {!hp && (
            <Button onClick={spawn}>
              <IconGame name="skull" size="20px" /> Spawn
            </Button>
          )}
          <Row>
            <Col>
              <Button onClick={refresh}>Refresh</Button>
            </Col>
          </Row>
        </div>
        {hp > 0 && [
          <div className={styles.actionBoxRow}>
            <Button
              onClick={blocked ? undefined : moveCharacter}
              name="up"
              className={blocked ? styles.disabled : ""}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <ArrowCircleUpIcon className="iconDark" />
            </Button>
            <Row>
              <Col>
                <Button
                  onClick={blocked ? undefined : moveCharacter}
                  name="left"
                  className={blocked ? styles.disabled : ""}
                  title={blocked ? "no more hp nor energy, please rest :(" : ""}
                >
                  <ArrowCircleLeftIcon className="iconDark" />
                </Button>
              </Col>

              <Col>
                <Button
                  onClick={blocked ? undefined : moveCharacter}
                  name="right"
                  className={blocked ? styles.disabled : ""}
                  title={blocked ? "no more hp nor energy, please rest :(" : ""}
                >
                  <ArrowCircleRightIcon className="iconDark" />
                </Button>
              </Col>
            </Row>

            <Button
              onClick={blocked ? undefined : moveCharacter}
              name="down"
              className={blocked ? styles.disabled : ""}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <ArrowDropDownCircleIcon className="iconDark" />
            </Button>
          </div>,
          <div className={styles.actionBoxRow}>
            <Button
              onClick={blocked ? undefined : mine}
              className={blocked ? styles.disabled : ""}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <IconGame name="mining" size="20px" />
              Mine
            </Button>
            <Button
              onClick={blocked ? undefined : rest}
              className={!hp ? styles.disabled : ""}
              title={blocked ? "no more hp  :(" : ""}
            >
              <IconGame name="rest2" size="20px" /> Rest
            </Button>
          </div>,
        ]}
      </div>
    </>
  );
};

export default ActionBox;
