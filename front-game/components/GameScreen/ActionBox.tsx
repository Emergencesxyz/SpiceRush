import styles from "./GameScreenC.module.scss";

import { Row, Button, Col } from "react-bootstrap";
import { useState, FunctionComponent } from "react";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import IconGame from "./IconGame";

interface Props {
  character: any;
  actions: number;
  setActions: Function;
  characterId: number | null;
  setLoading: Function;
  setOriginCoords: Function;
}

const ActionBox: FunctionComponent<Props> = ({
  character,
  actions,
  setActions,
  characterId,
  setLoading,
  setOriginCoords,
}): JSX.Element => {
  const { account, library } = useWeb3React();
  const [sounds, setSounds] = useState<Object | null>(null);

  const blockchainService = new BlockchainService(account);

  const moveCharacter = async (e: any) => {
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

    let res = await blockchainService.moveCharacter(
      characterId as number,
      x,
      y,
      library
    );
    console.log("res", res);
  };

  const spawn = async (e: any) => {
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();
    return await blockchainService.spawn(characterId as number, library);
  };

  const rest = async (e: any) => {
    console.log("rest");
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();
    return await blockchainService.rest(characterId as number, 1, library);
  };

  const mine = async (e: any) => {
    const audioScifi = new Audio("./sounds/button_scifi.mp3");
    audioScifi.play();
    await blockchainService.mine(characterId as number, 1, library);

    return;
  };

  const center = async (e: any) => {
    console.log("center");

    console.log("character", character);
    if (character && Number.isInteger(character.x))
      setOriginCoords({ x: character.x, y: character.y });
    else setOriginCoords({ x: 0, y: 0 });
  };

  const refresh = async (e: any) => {
    console.log("mine actions", actions);
    setActions(actions++);
  };

  let { energy, hp, mining } = { energy: 0, hp: 0, mining: 0 };
  let blocked = true;
  if (character) {
    energy = character.stats.energy;
    hp = character.stats.hp;
    mining = character.stats.mining;
    blocked = !(energy && hp);
  }

  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div className={styles.actionBoxRow}>
          {!hp && (
            <button onClick={spawn} className={styles.pushable}>
              <span className={styles.front}>
                {" "}
                <IconGame name="skull" size="20px" /> Spawn
              </span>
            </button>
          )}
          <Row>
            <Col>
              <button onClick={refresh} className={styles.pushable}>
                <span className={styles.front}>Refresh</span>
              </button>
            </Col>
            <Col>
              <button onClick={center} className={styles.pushable}>
                <span className={styles.front}>Center map.</span>
              </button>
            </Col>
          </Row>
        </div>
        {hp > 0 && [
          <div key={1} className={styles.actionBoxRow}>
            <button
              onClick={blocked ? undefined : moveCharacter}
              className={blocked ? styles.pushable : styles.pushable}
              name="up"
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <span
                className={styles.front}
                style={{ backgroundColor: !blocked ? "none" : "grey" }}
              >
                <ArrowCircleUpIcon />
              </span>
            </button>

            <Row>
              <Col>
                <button
                  onClick={blocked ? undefined : moveCharacter}
                  className={blocked ? styles.pushable : styles.pushable}
                  name="left"
                  title={blocked ? "no more hp nor energy, please rest :(" : ""}
                >
                  <span
                    className={styles.front}
                    style={{ backgroundColor: !blocked ? "none" : "grey" }}
                  >
                    <ArrowCircleLeftIcon />
                  </span>
                </button>
              </Col>

              <Col>
                <button
                  onClick={blocked ? undefined : moveCharacter}
                  className={blocked ? styles.pushable : styles.pushable}
                  name="right"
                  title={blocked ? "no more hp nor energy, please rest :(" : ""}
                >
                  <span
                    className={styles.front}
                    style={{ backgroundColor: !blocked ? "none" : "grey" }}
                  >
                    <ArrowCircleRightIcon />
                  </span>
                </button>
              </Col>
            </Row>

            <button
              onClick={blocked ? undefined : moveCharacter}
              className={blocked ? styles.pushable : styles.pushable}
              name="down"
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <span
                className={styles.front}
                style={{ backgroundColor: !blocked ? "none" : "grey" }}
              >
                <ArrowDropDownCircleIcon />
              </span>
            </button>
          </div>,
          <div key={2} className={styles.actionBoxRow}>
            <button
              onClick={blocked ? undefined : mine}
              className={styles.pushable}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <span
                className={styles.front}
                style={{ backgroundColor: !blocked ? "none" : "grey" }}
              >
                <IconGame name="mining" size="20px" /> Mine
              </span>
            </button>

            <button
              onClick={!hp ? undefined : rest}
              className={styles.pushable}
              title={blocked ? "no more hp  :(" : ""}
            >
              <span
                className={styles.front}
                style={{ backgroundColor: hp ? "none" : "grey" }}
              >
                <IconGame name="rest2" size="20px" /> Rest
              </span>
            </button>
          </div>,
        ]}
      </div>
    </>
  );
};

export default ActionBox;
