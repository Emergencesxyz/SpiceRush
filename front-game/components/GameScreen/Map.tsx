import styles from "./GameScreenC.module.scss";

import { Row, Col, Button } from "react-bootstrap";
import { FunctionComponent, useState, useEffect } from "react";
import Tile from "./Tile";

import axios from "axios";

import BlockchainService from "../../services/BlockchainService";
import { TileType } from "../../types";

import { isMobile } from "react-device-detect";

interface Props {
  tiles: Array<TileType>;
  character: any;
  originCoords: any;
  setOriginCoords: Function;
  setLoading: Function;
  characters: Array<any>;
}
const API_URL = process.env.API_URL;
const DEFAULT_CHUNK_SIZE = isMobile
  ? 3
  : parseInt(process.env.DEFAULT_CHUNK_SIZE as string);

const Map: FunctionComponent<Props> = ({
  tiles,
  character,
  originCoords,
  setOriginCoords,
  setLoading,
  characters,
}): JSX.Element => {
  const blockchainService = new BlockchainService(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("originCoords", originCoords);
      } catch (e: any) {}
    })();
  }, [originCoords]);

  const moveMap = async (e: any) => {
    let x: number, y: number;

    if (e.target.name === "right") {
      x = originCoords.x;
      y = originCoords.y + 1;
    } else if (e.target.name === "left") {
      x = originCoords.x;
      y = originCoords.y - 1;
    } else if (e.target.name === "up") {
      x = originCoords.x - 1;
      y = originCoords.y;
    } else if (e.target.name === "down") {
      x = originCoords.x + 1;
      y = originCoords.y;
    } else return;

    setOriginCoords({ x, y });
    setLoading(true);
  };

  // console.log("Map characters", characters);

  console.log("[RENDER] MAP with coords", originCoords);
  const { x, y } = originCoords;

  let chunk: any = tiles.filter(
    (tile: any) =>
      tile.y >= y - Math.floor(DEFAULT_CHUNK_SIZE / 2) &&
      tile.y < y + Math.ceil(DEFAULT_CHUNK_SIZE / 2) &&
      tile.x >= x - Math.floor(DEFAULT_CHUNK_SIZE / 2) &&
      tile.x < x + Math.ceil(DEFAULT_CHUNK_SIZE / 2)
  );

  let tilesComponent = [];

  if (chunk && chunk.length) {
    const xMin = (chunk[0] as any).x;
    const yMin = (chunk[0] as any).y;
    const xMax = xMin + Math.ceil(Math.sqrt(chunk.length));
    const yMax = yMin + Math.ceil(Math.sqrt(chunk.length));

    for (let x = xMin; x < xMax; x++) {
      let row = [];
      for (let y = yMin; y < yMax; y++) {
        let tile: any = tiles.filter(
          (tile) => (tile as any).x === x && (tile as any).y === y
        )[0];

        if (!tile) continue;

        const currentPosition =
          character && character.x === tile.x && character.y === tile.y;

        const countCharacters = characters
          ? characters?.filter((c) => c.x === tile.x && c.y === tile.y).length
          : 0;

        row.push(
          <Tile
            key={tile.x + ";" + tile.y}
            level={tile.level}
            spiceAmount={tile.spiceAmount}
            foesAmount={tile.foesAmount}
            isExplored={tile.isExplored}
            currentPosition={currentPosition}
            x={tile.x}
            y={tile.y}
            countCharacters={countCharacters}
            characters={characters}
          />
        );
      }
      tilesComponent.push(<div>{row}</div>);
    }
  }

  return (
    <>
      <div className={styles.map}>
        <Row className={styles.buttonCol}>
          <Button name="up" onClick={moveMap}>
            ▲
          </Button>
        </Row>
        <Row>
          <Col xs={2} className={styles.buttonCol}>
            <Button name="left" onClick={moveMap}>
              ◄
            </Button>
          </Col>
          <Col xs={8}>{tilesComponent}</Col>
          <Col xs={2} className={styles.buttonCol}>
            <Button name="right" onClick={moveMap}>
              ►
            </Button>
          </Col>
        </Row>
        <Row className={styles.buttonCol}>
          <Button name="down" onClick={moveMap}>
            ▼
          </Button>
        </Row>
      </div>
    </>
  );
};

export default Map;
