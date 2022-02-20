import styles from "./GameScreen.module.scss";

import { Row, Col, Button } from "react-bootstrap";
import { FunctionComponent } from "react";
import Tile from "./Tile";

import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

interface Props {
  tiles: Array<Object>;
  character: any;
  originCoords: any;
  setOriginCoords: Function;
  setLoading: Function;
}

const Map: FunctionComponent<Props> = ({
  tiles,
  character,
  originCoords,
  setOriginCoords,
  setLoading,
}): JSX.Element => {
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

  const tilesComponent = tiles.map((row: any, index: number) => {
    return (
      <div key={index}>
        {row.map(function (tile: any) {
          const currentPosition =
            character && character.x === tile.x && character.y === tile.y;

          return (
            <Tile
              key={tile.x + ";" + tile.y}
              level={tile.level}
              spiceAmount={tile.spiceAmount}
              foesAmount={tile.foesAmount}
              isExplored={tile.isExplored}
              currentPosition={currentPosition}
              x={tile.x}
              y={tile.y}
            />
          );
        })}
      </div>
    );
  });
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
