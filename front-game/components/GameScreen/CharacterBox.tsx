import styles from "./GameScreen.module.scss";

import { FunctionComponent } from "react";
import { Button } from "react-bootstrap";
import IconGame from "./IconGame";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

interface Props {
  character: any;
  spiceMined: number | null;
  characterId: number | null;
}

const CharacterBox: FunctionComponent<Props> = ({
  character,
  spiceMined,
  characterId,
}): JSX.Element => {
  const { account, library } = useWeb3React();
  const { energy, hp, mining, energyMax, hpMax, miningMax } = character.stats;
  const blockchainService = new BlockchainService(account);
  const lvlUp = async (e: any) => {
    console.log("lvlUp", e.target);
    e.stopPropagation();
    return await blockchainService.levelUp(
      characterId as number,
      e.target.name,
      library
    );
  };

  return (
    <>
      <div className={styles.characterBox}>
        <h4>
          Apinator #{characterId} {!hp ? <IconGame name="skull" /> : null}
        </h4>
        lvl {character.lvl} ⬪ {character.xp} xp ⬪ ({character.x}, {character.y}){" "}
        <br />
        <IconGame name="energy" />
        <span style={{ color: energy === 0 ? "red" : undefined }}>
          {energy} / {energyMax}
          <Button onClick={lvlUp} className={"button-no-bg"} name="1">
            <img
              src={"/icons/arrow_up.gif"}
              alt={"UP"}
              style={{ maxWidth: "20px", pointerEvents: "none" }}
            />
          </Button>
        </span>
        ⬪
        <IconGame name="hp" />
        <span style={{ color: hp === 0 ? "red" : undefined }}>
          {hp} / {hpMax}
          <Button onClick={lvlUp} className={"button-no-bg"} name="2">
            <img
              src={"/icons/arrow_up.gif"}
              alt={"UP"}
              style={{ maxWidth: "20px", pointerEvents: "none" }}
            />
          </Button>
        </span>
        ⬪
        <IconGame name="mining" />
        {mining} / {miningMax}
        <Button onClick={lvlUp} className={"button-no-bg"} name="3">
          <img
            src={"/icons/arrow_up.gif"}
            alt={"UP"}
            style={{ maxWidth: "20px", pointerEvents: "none" }}
          />
        </Button>
        ⬪
        <IconGame name="gem" />
        {spiceMined}
      </div>
    </>
  );
};

export default CharacterBox;
