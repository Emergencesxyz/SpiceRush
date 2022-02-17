import styles from "./Map.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const CharacterBox: FunctionComponent = ({ character }): JSX.Element => {
  return (
    <>
      <div className={styles.characterBox}>
        lvl {character.lvl} ⬪ {character.xp} xp ⬪ ({character.x}, {character.y}){" "}
        <br />
        <img
          src="/icons/energy.png"
          alt="energy"
          className={styles.icon}
        />{" "}
        {character.stats.energy} ⬪
        <img src="/icons/hp.png" alt="hp" className={styles.icon} />
        {character.stats.hp} ⬪
        <img src="/icons/mining.png" alt="hp" className={styles.icon} />
        {character.stats.mining}
      </div>
    </>
  );
};

export default CharacterBox;
