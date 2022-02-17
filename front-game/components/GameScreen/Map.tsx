import styles from "./GameScreen.module.scss";

import { Row, Col, Button } from "react-bootstrap";
import { FunctionComponent } from "react";
import Tile from "./Tile";

import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const Map: FunctionComponent = ({ tiles, character }): JSX.Element => {
  const tilesComponent = tiles.map((row) => {
    return (
      <div>
        {row.map(function (tile: any) {
          const currentPosition =
            character.x === tile.x && character.y === tile.y;

          return (
            <Tile
              level={tile.level}
              spiceAmount={tile.spiceAmount}
              foesAmount={tile.foesAmount}
              isExplored={tile.isExplored}
              currentPosition={currentPosition}
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
          <Button name="up">
            <ArrowCircleUpIcon className="iconLight" />
          </Button>
        </Row>
        <Row>
          <Col xs={2} className={styles.buttonCol}>
            <Button name="left">
              <ArrowCircleLeftIcon className="iconLight" />
            </Button>
          </Col>
          <Col xs={8}>{tilesComponent}</Col>
          <Col xs={2} className={styles.buttonCol}>
            <Button name="right">
              <ArrowCircleRightIcon className="iconLight" />
            </Button>
          </Col>
        </Row>
        <Row className={styles.buttonCol}>
          <Button name="down">
            <ArrowDropDownCircleIcon className="iconLight" />
          </Button>
        </Row>
      </div>
    </>
  );
};

export default Map;
