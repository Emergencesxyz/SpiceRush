import styles from "./GameScreen.module.scss";

import { Row, Col, Button } from "react-bootstrap";
import { FunctionComponent, useState, useEffect } from "react";
import Tile from "./Tile";

import axios from "axios";

interface Props {
  tiles: Array<Object>;
  character: any;
  originCoords: any;
  setOriginCoords: Function;
  setLoading: Function;
}
const API_URL = process.env.API_URL;

const Map: FunctionComponent<Props> = ({
  tiles,
  character,
  originCoords,
  setOriginCoords,
  setLoading,
}): JSX.Element => {
  const [characters, setCharacters] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      try {
        let characters_ = (await axios.get(API_URL + `/character`)).data.result;
        console.log("characters_", characters_);
        setCharacters(characters_);
      } catch (e: any) {
        console.log("e", e.toString());
      }
    })();
  }, []);

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

  console.log("Map characters", characters);

  const xMin = tiles[0].x;
  const yMin = tiles[0].y;
  const xMax = xMin + Math.ceil(Math.sqrt(tiles.length));
  const yMax = yMin + Math.ceil(Math.sqrt(tiles.length));

  console.log("xMin", xMin, "yMin", yMin, "xMax", xMax, "yMax", yMax);

  let tilesComponent = [];
  for (let x = xMin; x < xMax; x++) {
    let row = [];
    for (let y = yMin; y < yMax; y++) {
      let tile: any = tiles.filter((tile) => tile.x === x && tile.y === y)[0];

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
  console.log("tilesComponent", tilesComponent);

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
