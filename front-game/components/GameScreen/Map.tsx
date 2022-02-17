import styles from "./GameScreen.module.scss";

import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import Tile from "../Tile/Tile";

const Map: FunctionComponent = ({ tiles, character }): JSX.Element => {
  return (
    <>
      <div className={styles.map}>
        {tiles.map((row) => {
          return (
            <div>
              {row.map(function (tile: any) {
                const currentPosition =
                  character.x === tile.x && character.y === tile.y;

                return (
                  <Tile level={tile.level} currentPosition={currentPosition} />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Map;
