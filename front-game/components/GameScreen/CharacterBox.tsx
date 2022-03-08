import styles from "./GameScreenC.module.scss";

import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import IconGame from "./IconGame";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import consts from "../../consts";

interface Props {
  character: any;
  spiceMined: number | null;
  characterId: number | null;
  toast: Function;
  setTutorialStep: Function;
}

const CharacterBox: FunctionComponent<Props> = ({
  character,
  spiceMined,
  characterId,
  toast,
  setTutorialStep,
}): JSX.Element => {
  const { account, library } = useWeb3React();
  const { energy, hp, mining, energyMax, hpMax, miningMax } = character.stats;

  const [canLvlUp, setCanLvlUp] = useState<any>(false);

  const blockchainService = new BlockchainService(account);

  useEffect(() => {
    (async () => {
      setCanLvlUp(await blockchainService.canLevelUp(characterId));
    })();
  }, [character]);

  const lvlUp = async (e: any) => {
    console.log("lvlUp", e.target);
    e.stopPropagation();
    return await blockchainService.levelUp(
      characterId as number,
      e.target.name,
      library
    );
  };

  const showTutorial = async (e: any, msg: string) => {
    toast(
      (t: any) => (
        <div>
          {msg} <br />
          <Button
            className={styles.nobg}
            onClick={() => (toast as any).dismiss(t.id)}
          >
            ❌
          </Button>
        </div>
      ),
      { duration: 10000 }
    );
  };

  return (
    <>
      <div className={styles.characterBox}>
        <h4>
          Apinator #{character.name ? character.name : characterId}{" "}
          {!hp ? <IconGame name="skull" /> : null}
        </h4>
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.lvl)}
          className={styles.characterItem}
        >
          <span style={{ color: canLvlUp ? "orange" : "inherit" }}>
            lvl {character.lvl} {canLvlUp ? "(UP)" : ""}
          </span>{" "}
        </span>
        ⬪{" "}
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.xp)}
          className={styles.characterItem}
        >
          {character.xp} xp ⬪{" "}
        </span>{" "}
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.position)}
          className={styles.characterItem}
        >
          ({character.x}, {character.y})
        </span>
        <Button onClick={(e) => setTutorialStep(0)} className={styles.nobg}>
          <IconGame name="question" size="20px" extension="gif" />{" "}
        </Button>
        <br />
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.energy)}
          className={styles.characterItem}
        >
          <IconGame name="energy" />

          <span style={{ color: energy === 0 ? "red" : undefined }}>
            {energy} / {energyMax}
            {canLvlUp && (
              <Button onClick={lvlUp} className={"button-no-bg"} name="2">
                <img
                  src={"/icons/arrow_up.gif"}
                  alt={"UP"}
                  style={{ maxWidth: "20px", pointerEvents: "none" }}
                />
              </Button>
            )}
          </span>
        </span>
        ⬪
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.hp)}
          className={styles.characterItem}
        >
          <IconGame name="hp" />
          <span style={{ color: hp === 0 ? "red" : undefined }}>
            {hp} / {hpMax}
            {canLvlUp && (
              <Button onClick={lvlUp} className={"button-no-bg"} name="1">
                <img
                  src={"/icons/arrow_up.gif"}
                  alt={"UP"}
                  style={{ maxWidth: "20px", pointerEvents: "none" }}
                />
              </Button>
            )}
          </span>
        </span>
        ⬪
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.mining)}
          className={styles.characterItem}
        >
          <IconGame name="mining" />
          {mining}
        </span>
        {canLvlUp && (
          <Button onClick={lvlUp} className={"button-no-bg"} name="3">
            <img
              src={"/icons/arrow_up.gif"}
              alt={"UP"}
              style={{ maxWidth: "20px", pointerEvents: "none" }}
            />
          </Button>
        )}
        ⬪
        <span
          onClick={(e) => showTutorial(e, consts.tutorial_character.spiceMined)}
          className={styles.characterItem}
        >
          <IconGame name="gem" />
          {spiceMined}
        </span>
      </div>
      <br />
    </>
  );
};

export default CharacterBox;
