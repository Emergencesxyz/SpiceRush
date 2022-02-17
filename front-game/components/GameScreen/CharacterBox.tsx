import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

import TypeWriterEffect from "react-typewriter-effect";

const CharacterBox: FunctionComponent = ({ character }): JSX.Element => {
  const { energy, hp, mining } = character.stats;
  return (
    <>
      <div className={styles.characterBox}>
        <h4>ApezorDu45</h4>
        lvl {character.lvl} ⬪ {character.xp} xp ⬪ ({character.x}, {character.y}){" "}
        <br />
        <IconGame name="energy" />
        <span style={{ color: energy === "0" ? "red" : undefined }}>
          {energy}
        </span>{" "}
        ⬪
        <IconGame name="hp" />
        <span style={{ color: hp === "0" ? "red" : undefined }}>{hp}</span> ⬪
        <IconGame name="mining" />
        {mining}
      </div>
    </>
  );
};

export default CharacterBox;
