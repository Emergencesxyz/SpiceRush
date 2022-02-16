import styles from "./Tile.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const Tile: FunctionComponent = ({ level }): JSX.Element => {
  return (
    <>
      <div className={styles.tile}>{level}</div>
    </>
  );
};

export default Tile;
