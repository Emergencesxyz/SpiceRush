import styles from "./Tile.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const Tile: FunctionComponent = ({ level, currentPosition }): JSX.Element => {
  return (
    <>
      <div className={currentPosition ? styles.tileCurrent : styles.tile}>
        {level}
      </div>
    </>
  );
};

export default Tile;
