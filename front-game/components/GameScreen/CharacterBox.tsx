import styles from "./GameScreenC.module.scss";

import { FunctionComponent, useEffect, useState } from "react";
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

  return (
    <>
      <div className={styles.characterBox}>
        <h4>
          Apinator #{characterId} {!hp ? <IconGame name="skull" /> : null}
        </h4>
        <span style={{ color: canLvlUp ? "orange" : "inherit" }}>
          lvl {character.lvl} {canLvlUp ? "(UP)" : ""}
        </span>{" "}
        ⬪ {character.xp} xp ⬪ ({character.x}, {character.y}) <br />
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
        ⬪
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
        ⬪
        <IconGame name="mining" />
        {mining}
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
        <IconGame name="gem" />
        {spiceMined}
      </div>
    </>
  );
};

export default CharacterBox;
