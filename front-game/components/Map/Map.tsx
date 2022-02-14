import styles from "./Map.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import Tile from "../Tile/Tile";
const Header: FunctionComponent = (): JSX.Element => {
  let x0 = 0;
  let y0 = 0;

  let tiles = [];
  for (let x = 0; x < 10; x++) {
    let row_tiles = [];
    for (let y = 0; y < 10; y++) {
      row_tiles.push(<Tile />);
    }
    tiles.push(<Row>{row_tiles}</Row>);
  }
  return <>{tiles}</>;
};

export default Header;
