import styles from "./Tile.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

const Tile: FunctionComponent = ({
  level,
  currentPosition,
  spiceAmount,
  foesAmount,
}): JSX.Element => {
  console.log("foesAmount", foesAmount, ", spiceAmount", spiceAmount);
  const color = parseInt(((level ? level + 5 : 0) * 255) / 100);

  return (
    <>
      <div
        className={styles.tile}
        style={{ backgroundColor: "rgb(" + color + ",10,100)" }}
      >
        <div className={styles.tile_text}>
          <IconGame name="gem" size="20px" />
          {spiceAmount}
        </div>

        <div>
          <IconGame name="skull" size="20px" />
          {foesAmount}
        </div>
      </div>
    </>
  );
};

export default Tile;
