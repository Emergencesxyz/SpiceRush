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
  const [tiles, setTiles] = useState<Array<any>>([]);
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

      setTiles(await blockchainService.getMapChunk(0, 0, 6));
    })();
  }, [library]);

  //build tile
  let row_tiles = [];
  for (let i = 0; i < tiles.length; i++) {
    row_tiles.push(<Tile />);
  }

  let tiles_html = tiles.map((row) => {
    console.log("row", row);
    return (
      <Row>
        {row.map((tile) => (
          <Tile level={tile.level} />
        ))}
      </Row>
    );
  });
  return (
    <>
      <div className={styles.map}>
        <div>{tiles_html}</div>
      </div>
    </>
  );
};

export default Map;
