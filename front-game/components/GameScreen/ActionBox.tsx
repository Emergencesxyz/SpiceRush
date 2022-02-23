import styles from "./GameScreen.module.scss";

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
}

const ActionBox: FunctionComponent<Props> = ({
  character,
  actions,
  setActions,
  characterId,
  setLoading,
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
          <div key={1} className={styles.actionBoxRow}>
            <Button
              onClick={blocked ? undefined : moveCharacter}
              name="up"
              className={blocked ? styles.disabled : ""}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <span style={{ pointerEvents: "none" }}>
                <ArrowCircleUpIcon className="iconDark" />
              </span>
            </Button>
            <Row>
              <Col>
                <Button
                  onClick={blocked ? undefined : moveCharacter}
                  name="left"
                  className={blocked ? styles.disabled : ""}
                  title={blocked ? "no more hp nor energy, please rest :(" : ""}
                >
                  <span style={{ pointerEvents: "none" }}>
                    <ArrowCircleLeftIcon className="iconDark" />
                  </span>
                </Button>
              </Col>

              <Col>
                <Button
                  onClick={blocked ? undefined : moveCharacter}
                  name="right"
                  className={blocked ? styles.disabled : ""}
                  title={blocked ? "no more hp nor energy, please rest :(" : ""}
                >
                  <span style={{ pointerEvents: "none" }}>
                    <ArrowCircleRightIcon className="iconDark" />
                  </span>
                </Button>
              </Col>
            </Row>

            <Button
              onClick={blocked ? undefined : moveCharacter}
              name="down"
              className={blocked ? styles.disabled : ""}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <span style={{ pointerEvents: "none" }}>
                <ArrowDropDownCircleIcon className="iconDark" />
              </span>
            </Button>
          </div>,
          <div key={2} className={styles.actionBoxRow}>
            <Button
              onClick={blocked ? undefined : mine}
              className={blocked ? styles.disabled : ""}
              title={blocked ? "no more hp nor energy, please rest :(" : ""}
            >
              <IconGame name="mining" size="20px" />
              Mine
            </Button>
            <Button
              onClick={rest}
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
