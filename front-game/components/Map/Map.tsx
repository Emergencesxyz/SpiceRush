import styles from "./Map.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import Tile from "../Tile/Tile";

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import BlockchainService from "../../services/BlockchainService";

import consts from "../../consts";

const Map: FunctionComponent = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);

  let x0 = 0;
  let y0 = 0;

  const blockchainService = new BlockchainService(account, "0x");

  useEffect(() => {
    (async () => {
      if (!library) return;
      console.log("library_", library);

      setUserBalance(await library.eth.getBalance(account));
      // console.log(" balance ", await blockchainService.getBalance());
      // //console.log(" getTileInfo ", blockchainService.getTileInfo());
      // console.log("owner of", await blockchainService.ownerOf());
      console.log("owner of", await blockchainService.getCharacterCoords(0));
    })();
  }, [library]);

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
      <div className={styles.map}>
        <h1>{userBalance}</h1>
        <div>{tiles}</div>
      </div>
    </>
  );
};

export default Map;
