import styles from "./GameScreen.module.scss";
import { Row, Col, Spinner, Toast } from "react-bootstrap";
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
  const [character, setCharacter] = useState<any | null>(null);
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [spawned, setSpawned] = useState<Boolean>(false);
  const [spiceMined, setSpiceMined] = useState<number | null>(null);
  const [actions, setActions] = useState<number>(0);
  const [randomQuoteId, setRandomQuoteId] = useState<number>(0);
  const [originCoords, setOriginCoords] = useState<any>({
    x: null,
    y: null,
  });
  const [loading, setLoading] = useState<Boolean>(false);
  const [toastMessage, setToastMessage] = useState<String>("");

  const mapSize = consts.defaultChunkSize;
  const blockchainService = new BlockchainService(account);

  useEffect(() => {
    (async () => {
      if (!randomQuoteId)
        setRandomQuoteId(Math.floor(randomQuotes.length * Math.random()));

      if (!library) return;

      setUserBalance(await library.eth.getBalance(account));

      const _character: any =
        characterId === null
          ? {}
          : await blockchainService.getCharacterInfo(characterId);

      //center map around character or (0,0) at first
      let x0 = originCoords.x;
      let y0 = originCoords.y;
      if (!Number.isInteger(y0) || !Number.isInteger(x0)) {
        if (_character && _character.x) {
          x0 = _character.x;
          y0 = _character.y;
        } else {
          x0 = 0;
          y0 = 0;
        }

        setOriginCoords({ x: x0, y: y0 });
      }

      let tiles;
      tiles = await blockchainService.getMapChunk(x0, y0, mapSize);
      console.log("x0, y0", x0, y0);
      console.log("tiles", tiles);
      setTiles(tiles);

      //load charater info
      if (_character && Number.isInteger(_character.x)) {
        setCharacter(_character);
        setSpiceMined(await blockchainService.getSpiceMined(characterId));
      }

      setLoading(false);
    })();
  }, [library, actions, originCoords, characterId, toastMessage]);

  const selectNft = async (e: any) => {
    // @ts-ignore: Object is possibly 'null'.
    let element = document ? document!.getElementById("nftId").value : null;
    let nftId = element !== null ? parseInt(element) : 0;

    let owner = await blockchainService.ownerOf(nftId as number);

    if (owner === account) {
      setCharacterId(nftId);
      setLoading(true);
    } else setToastMessage("This NFT doesn't belong to you come on.");
    return;
  };

  const mintNft = async (e: any) => {
    await blockchainService.mintNft(1, library);
    return;
  };

  //render
  console.log("Gamescreen loading", character);
  return (
    <>
      <div className={styles.canvas}>
        <Toast
          show={toastMessage && toastMessage.length > 0}
          className={styles.toast}
          onClose={() => setToastMessage("")}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Info</strong>
            <small> </small>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>

        <Row>
          <span className={styles.quotes}>{randomQuotes[randomQuoteId]}</span>
        </Row>

        <Row>
          <Col xs={5}></Col>
          <Col xs={3}>
            <Row>
              <label>Choose NFT character.</label>
              <input
                type="number"
                placeholder="nftId"
                id="nftId"
                defaultValue="0"
              ></input>
              <button onClick={selectNft} className={styles.pushable}>
                <span className={styles.front}>select ID</span>
              </button>
              <div>or</div>
              <button onClick={mintNft} className={styles.pushable}>
                <span className={styles.front}> mint 1</span>
              </button>
              <br />{" "}
            </Row>
          </Col>
        </Row>

        {loading && (
          <Row>
            <Col xs={5}></Col>
            <Col xs={1}>
              <Spinner animation="grow" />
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={8}>
            {character && (
              <Row>
                <Col xs={3}>
                  <NftAvatar />
                </Col>
                <Col>
                  {character ? (
                    <CharacterBox
                      character={character}
                      spiceMined={spiceMined}
                      characterId={characterId}
                    />
                  ) : (
                    <img src={"/robot.gif"} className={styles.loadingGif} />
                  )}
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        <Row>
          <Col>
            {tiles && tiles.length ? (
              <Map
                tiles={tiles}
                character={character}
                setOriginCoords={setOriginCoords}
                originCoords={originCoords}
                setLoading={setLoading}
              />
            ) : (
              <MapPlaceholder length={mapSize} />
            )}
          </Col>
          {character && (
            <Col xs={4}>
              <ActionBox
                character={character}
                actions={actions}
                setActions={setActions}
                characterId={characterId}
                setLoading={setLoading}
              />
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default GameScreen;
