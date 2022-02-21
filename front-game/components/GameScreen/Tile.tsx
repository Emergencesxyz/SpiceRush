import styles from "./Tile.module.scss";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

interface Props {
  level: number;
  currentPosition: boolean;
  spiceAmount: number | null;
  foesAmount: number | null;
  isExplored: boolean;
  x: number;
  y: number;
  countCharacters: number;
}

const Tile: FunctionComponent<Props> = ({
  level,
  currentPosition,
  spiceAmount,
  foesAmount,
  isExplored,
  x,
  y,
  countCharacters,
}): JSX.Element => {
  const color = Math.floor(((level ? level + 5 : 0) * 255) / 100);

  return (
    <>
      <div
        className={styles.tile}
        title={`(${x},${y})`}
        style={{
          backgroundColor: "rgb(" + color + ",10,100)",
          filter: isExplored ? "brightness(100%)" : "brightness(50%)",
          border: currentPosition ? "cyan 2px dashed" : undefined,
        }}
      >
        {isExplored && (
          <div>
            <IconGame name="gem" size="15px" />
            {spiceAmount}
          </div>
        )}

        {isExplored && (
          <div>
            <IconGame name="skull" size="15px" />
            {foesAmount}
          </div>
        )}
        {isExplored && countCharacters && (
          <div>
            <IconGame name="hood" size="15px" />
            {countCharacters}
          </div>
        )}
        {!isExplored && (
          <span>
            ?<br />‎
          </span>
        )}
      </div>
    </>
  );
};

export default Tile;
