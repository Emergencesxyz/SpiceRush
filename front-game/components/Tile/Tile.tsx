import styles from "./Tile.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const Tile: FunctionComponent = ({ level, currentPosition }): JSX.Element => {
  return (
    <>
      <div className={styles.tile + " current"}>
        {level} {currentPosition ? "X" : ""}
      </div>
    </>
  );
};

export default Tile;
