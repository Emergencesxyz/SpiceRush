import styles from "./Map.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import Tile from "../Tile/Tile";

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import BlockchainService from "../../services/BlockchainService";

const Map: FunctionComponent = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const provider = "http://localhost:8545";
  const web3 = new Web3(provider);
  let x0 = 0;
  let y0 = 0;

  //
  const blockchainService = new BlockchainService(web3, account, "0x", {});

  useEffect(() => {
    (async () => {
      console.log(" balance ", await blockchainService.getBalance());
      console.log(" getTileInfo ", blockchainService.getTileInfo());
    })();
  }, []);

  //build tile
  let tiles = [];
  for (let x = 0; x < 6; x++) {
    let row_tiles = [];
    for (let y = 0; y < 6; y++) {
      row_tiles.push(<Tile />);
    }
    tiles.push(<div>{row_tiles}</div>);
  }
  return (
    <>
      <div className={styles.map}>{tiles}</div>
    </>
  );
};

export default Map;
