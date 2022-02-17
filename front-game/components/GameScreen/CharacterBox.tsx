import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

import TypeWriterEffect from "react-typewriter-effect";

const CharacterBox: FunctionComponent = ({
  character,
  spiceMined,
}): JSX.Element => {
  const { energy, hp, mining, energyMax, hpMax, miningMax } = character.stats;
  return (
    <>
      <div className={styles.characterBox}>
        <h4>ApezorDu45 {!hp ? <IconGame name="skull" /> : null}</h4>
        lvl {character.lvl} ⬪ {character.xp} xp ⬪ ({character.x}, {character.y}){" "}
        <br />
        <IconGame name="energy" />
        <span style={{ color: energy === 0 ? "red" : undefined }}>
          {energy} / {energyMax}
        </span>{" "}
        ⬪
        <IconGame name="hp" />
        <span style={{ color: hp === 0 ? "red" : undefined }}>
          {hp} / {hpMax}
        </span>{" "}
        ⬪
        <IconGame name="mining" />
        {mining} / {miningMax}
        ⬪
        <IconGame name="gem" />
        {spiceMined}
      </div>
    </>
  );
};

export default CharacterBox;
