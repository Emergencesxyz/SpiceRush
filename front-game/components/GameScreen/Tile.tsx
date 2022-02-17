import styles from "./Tile.module.scss";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";

const Tile: FunctionComponent = ({
  level,
  currentPosition,
  spiceAmount,
  foesAmount,
  isExplored,
}): JSX.Element => {
  const color = parseInt(((level ? level + 5 : 0) * 255) / 100);

  return (
    <>
      <div
        className={styles.tile}
        style={{
          backgroundColor: "rgb(" + color + ",10,100)",
          filter: isExplored ? "brightness(100%)" : "brightness(50%)",
          border: currentPosition ? "cyan 1px solid" : undefined,
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
        {!isExplored && (
          <span>
            ?<br />‎
          </span>
        )}

        {}
      </div>
    </>
  );
};

export default Tile;
