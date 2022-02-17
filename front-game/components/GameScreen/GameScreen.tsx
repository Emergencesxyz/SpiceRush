import styles from "./GameScreen.module.scss";
import { Container, Row, Col, Placeholder } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import BlockchainService from "../../services/BlockchainService";

import consts from "../../consts";
import MapPlaceholder from "./MapPlaceholder";
import CharacterBox from "./CharacterBox";
import NftAvatar from "./NftAvatar";
import Map from "./Map";
import ActionBox from "./ActionBox";

const GameScreen: FunctionComponent = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tiles, setTiles] = useState<Array<any>>([]);
  const [character, setCharacter] = useState<Object | null>(null);
  const x0 = 0;
  const y0 = 0;
  const mapSize = 6;
  const blockchainService = new BlockchainService(account, "0x");

  useEffect(() => {
    (async () => {
      if (!library) return;
      console.log("library_", library);

      setUserBalance(await library.eth.getBalance(account));
      // console.log(" balance ", await blockchainService.getBalance());
      // //console.log(" getTileInfo ", blockchainService.getTileInfo());
      // console.log("owner of", await blockchainService.ownerOf());

      console.log("character", await blockchainService.getCharacterInfo(0));
      setCharacter(await blockchainService.getCharacterInfo(0));

      let tiles = await blockchainService.getMapChunk(x0, y0, mapSize);
      console.log("tiles", tiles);
      setTiles(tiles);
    })();
  }, [library]);

  //////build tile

  let tiles_html = [];

  console.log("tiles_html", tiles_html);
  //render
  return (
    <>
      <div className={styles.canvas}>
        <Row>
          <Col xs={8}>
            <Row>
              <Col xs={2}>
                <NftAvatar />
              </Col>
              <Col>{character && <CharacterBox character={character} />}</Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col>
            {tiles && tiles.length ? (
              <Map tiles={tiles} character={character} />
            ) : (
              <MapPlaceholder length={mapSize} />
            )}
          </Col>
          <Col xs={4}>
            <ActionBox />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GameScreen;
