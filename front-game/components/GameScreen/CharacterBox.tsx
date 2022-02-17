import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

const CharacterBox: FunctionComponent = ({ character }): JSX.Element => {
  return (
    <>
      <div className={styles.characterBox}>
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
