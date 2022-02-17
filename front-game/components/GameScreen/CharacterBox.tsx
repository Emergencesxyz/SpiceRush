import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

import TypeWriterEffect from "react-typewriter-effect";

const CharacterBox: FunctionComponent = ({ character }): JSX.Element => {
  return (
    <>
      <div className={styles.characterBox}>
        <h4>ApezorDu45</h4>
        lvl {character.lvl} ⬪ {character.xp} xp ⬪ ({character.x}, {character.y}){" "}
        <br />
        <IconGame name="energy" />
        {character.stats.energy} ⬪
        <IconGame name="hp" />
        {character.stats.hp} ⬪
        <IconGame name="mining" />
        {character.stats.mining}
      </div>
    </>
  );
};

export default CharacterBox;
