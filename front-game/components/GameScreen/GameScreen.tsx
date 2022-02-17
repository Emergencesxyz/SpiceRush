import styles from "./GameScreen.module.scss";
import { Container, Row, Col, Placeholder } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import { useWeb3React } from "@web3-react/core";

import BlockchainService from "../../services/BlockchainService";

import MapPlaceholder from "./MapPlaceholder";
import CharacterBox from "./CharacterBox";
import NftAvatar from "./NftAvatar";
import Map from "./Map";
import ActionBox from "./ActionBox";

import consts from "../../consts";
const { randomQuotes } = consts;

const GameScreen: FunctionComponent = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tiles, setTiles] = useState<Array<any>>([]);
  const [character, setCharacter] = useState<Object | null>(null);
  const [spiceMined, setSpiceMined] = useState<number | null>(null);
  const [actions, setActions] = useState<number>(0);
  const [randomQuoteId, setRandomQuoteId] = useState<number>(0);
  const x0 = 0;
  const y0 = 0;
  const mapSize = 6;
  const blockchainService = new BlockchainService(account);

  useEffect(() => {
    (async () => {
      console.log("useEffect actions", actions);
      if (!randomQuoteId)
        setRandomQuoteId(Math.floor(randomQuotes.length * Math.random()));

      if (!library) return;

      setUserBalance(await library.eth.getBalance(account));
      setCharacter(await blockchainService.getCharacterInfo(0));

      setSpiceMined(await blockchainService.getSpiceMined(0));
      let tiles = await blockchainService.getMapChunk(x0, y0, mapSize);

      setTiles(tiles);
    })();
  }, [library, actions]);

  //////build tile

  let tiles_html = [];

  //render

  return (
    <>
      <div className={styles.canvas}>
        <Row>
          <span className={styles.quotes}>{randomQuotes[randomQuoteId]}</span>
        </Row>
        <Row>
          <Col xs={8}>
            <Row>
              <Col xs={3}>
                <NftAvatar />
              </Col>
              <Col>
                {character ? (
                  <CharacterBox character={character} spiceMined={spiceMined} />
                ) : (
                  <img src={"/robot.gif"} className={styles.loadingGif} />
                )}
              </Col>
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
            <ActionBox
              character={character}
              actions={actions}
              setActions={setActions}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GameScreen;
