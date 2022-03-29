import styles from "./GameScreenC.module.scss";
import { Row, Col, Spinner, Toast, Accordion, Button } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { Contract, ethers } from "ethers";

import BlockchainService from "../../services/BlockchainService";
import DatabaseService from "../../services/DatabaseService";

import MapPlaceholder from "./MapPlaceholder";
import CharacterBox from "./CharacterBox";
import NftAvatar from "./NftAvatar";
import Map from "./Map";
import ActionBox from "./ActionBox";

import consts from "../../consts";

import { useCookies } from "react-cookie";

import { TileType } from "../../types";

import { Toaster, toast, useToaster } from "react-hot-toast";

import { isMobile } from "react-device-detect";

const { randomQuotes } = consts;

const GameScreen: FunctionComponent = (): JSX.Element => {
  const DEFAULT_CHUNK_SIZE = isMobile
    ? 3
    : parseInt(process.env.DEFAULT_CHUNK_SIZE as string);
  const DEFAULT_MAP_SIZE = parseInt(process.env.DEFAULT_MAP_SIZE as string);

  const API_URL = process.env.API_URL;
  const WSS_URL = process.env.WSS_URL;
  const GAMEPLAY_CONTRACT_ADDRESS = process.env.GAMEPLAY_CONTRACT_ADDRESS;
  const APINATOR_CONTRACT_ADDRESS = process.env.APINATOR_CONTRACT_ADDRESS;

  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tiles, setTiles] = useState<Array<TileType>>([]);
  const [character, setCharacter] = useState<any | null>(null);
  const [characterId, setCharacterId] = useState<number | null>(
    (cookies as any).characterId ? (cookies as any).characterId : null
  );
  const [spawned, setSpawned] = useState<Boolean>(false);
  const [spiceMined, setSpiceMined] = useState<number | null>(null);
  const [actions, setActions] = useState<number>(0);
  const [randomQuoteId, setRandomQuoteId] = useState<number>(0);
  const [originCoords, setOriginCoords] = useState<any>({
    x: 0,
    y: 0,
  });
  //x0 - Math.floor(chunkSize / 2
  const [loading, setLoading] = useState<Boolean>(false);
  const [toastMessage, setToastMessage] = useState<String>("");
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [events, setEvents] = useState<any>([]);
  const [characters, setCharacters] = useState<Array<any>>([]);

  const { toasts, handlers } = useToaster();

  const blockchainService = new BlockchainService(account);
  const databaseService = new DatabaseService();

  const provider = new ethers.providers.WebSocketProvider(WSS_URL as string);

  const gameplayContract = new ethers.Contract(
    GAMEPLAY_CONTRACT_ADDRESS as string,
    consts.gameplayABI,
    provider
  );

  const apinatorContract = new ethers.Contract(
    APINATOR_CONTRACT_ADDRESS as string,
    consts.apinatorABI,
    provider
  );

  const [dontRunTutorial, setTutorial] = useState<boolean | null>(
    (cookies as any).dontRunTutorial ? true : null
  );
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  const showTutorial = async () => {
    toast(
      (t) => (
        <div>
          {consts.tutorial_intro[tutorialStep]}

          <br />
          <Button
            className={styles.nobg}
            onClick={() => setTutorialStep(tutorialStep - 1)}
          >
            ⏪
          </Button>

          <Button className={styles.nobg} onClick={() => toast.dismiss()}>
            ❌
          </Button>

          <Button
            className={styles.nobg}
            onClick={() => setTutorialStep(tutorialStep + 1)}
          >
            ⏩
          </Button>
        </div>
      ),
      { duration: Infinity }
    );
  };

  useEffect(() => {
    (async () => {
      //intro tutorial
      async function sleep(ms: any) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      toast.dismiss();
      showTutorial();
      //await sleep(1000);

      //await sleep(Infinity);
      // toast("Let me guide you through this mess.");
      // await sleep(2000);
      // toast("First connect your wallet. I'll wait.");
      // await sleep(2000);
      // toast(
      //   "Now let's choose a character. Mint a NFT or if you have already minted one, input your id and press select."
      // );
    })();
  }, [tutorialStep]);

  useEffect(() => {
    (async () => {
      //refresh map &character every 10 seconds

      async function refresh() {
        console.log(`update tiles & characters!`);

        let _tiles = (await axios.get(API_URL + `/map`)).data.result;
        setTiles(_tiles as unknown as Array<TileType>);

        let characters_ = (await axios.get(API_URL + `/character`)).data.result;
        //console.log("characters_", characters_);
        setCharacters(characters_ as any);

        //wait a bit while  api is updating cached map
        (function sleep(ms: any) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        })(1000);
      }
      refresh();
      const interval = setInterval(() => refresh(), 10000);
      return () => {
        clearInterval(interval);
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log("useEffect 2");

      //refresh map every x second

      async function updateCharacter() {
        const _character: any =
          characterId === null
            ? {}
            : await blockchainService.getCharacterInfo(characterId);
        //load character info
        setCharacter(_character);
      }
      //event listeners that will popup in event box
      gameplayContract.on(
        "moving",
        async (tokenId, x, y, energy, xp, nextActionTime) => {
          const x_int = parseInt(x.toString());
          const y_int = parseInt(y.toString());

          toast(`🏃 #${tokenId} moved to (${x},${y}) !`);
          updateCharacter();
          setLoading(false);
        }
      );

      gameplayContract.on(
        "mining",
        (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          toast(`⛏️ #${tokenId} mined $${_spiceAmount}  !`);
          updateCharacter();
          setLoading(false);
        }
      );

      gameplayContract.on(
        "resting",
        async (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          toast(`😴 #${tokenId} is taking a nap  !`);
          setLoading(false);
          updateCharacter();
          setLoading(false);
        }
      );

      gameplayContract.on(
        "spawned",
        (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          toast(`🛬 #${tokenId} spawned on the map. Watch out !`);
          updateCharacter();
          setLoading(false);
        }
      );

      gameplayContract.on("died", (tokenId, _bank, x, y) => {
        toast(`💀 # ${tokenId} left us. RIP ! `);
        updateCharacter();
        setLoading(false);
      });

      gameplayContract.on(
        "leveledUp",
        (_tokenId, _mining, _hpMax, _energyMax) => {
          toast(`💪 #${_tokenId} has leveled up. Fear him !`);
          updateCharacter();
          setLoading(false);
        }
      );

      apinatorContract.on("Transfer", (from, to, tokenId) => {
        console.log("[EVENT] transfer");
        console.log("tokenId", from, to, tokenId);

        const _tokenId = parseInt(tokenId.toString());

        toast(`#${to.slice(0, 8)} minted NFT #${_tokenId}  !`);

        console.log("account ", account === to);
        if (account && to === account) {
          setCharacterId(_tokenId);
          setLoading(true);
        }
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      //shift map when origin coords are changed

      if (!tiles || !tiles.length || !originCoords) return;
      const x_ = tiles[0].x;
      const y_ = tiles[0].y;

      const { x, y } = originCoords;

      if (x_ !== x || y_ !== y) {
        let _tiles = (await axios.get(API_URL + `/map`)).data.result;
        setTiles(_tiles);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setRandomQuoteId(Math.floor(randomQuotes.length * Math.random()));

      if (!tiles || !tiles.length) {
        //DIRECT WEB3 CALL
        // let _tiles = await blockchainService.getMapChunk(
        //   originCoords.x,
        //   originCoords.y,
        //   DEFAULT_CHUNK_SIZE
        // );

        //with API
        let _tiles = (await axios.get(API_URL + `/map`)).data.result;

        setTiles(_tiles as unknown as Array<TileType>);

        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log("update my character");
      const _character: any =
        characterId === null
          ? {}
          : await blockchainService.getCharacterInfo(characterId);

      //load character info
      if (tiles && _character && Number.isInteger(_character.x)) {
        console.log("actually updating");
        setCharacter(_character);
        setSpiceMined(await blockchainService.getSpiceMined(characterId));
      }
    })();
  }, [characterId, events]);

  const selectNft = async (e: any) => {
    // @ts-ignore: Object is possibly 'null'.
    let element = document ? document!.getElementById("nftId").value : null;
    let nftId = element !== null ? parseInt(element) : 0;

    let owner = await blockchainService.ownerOf(nftId as number);

    if (owner === account) {
      setCookie("characterId" as "cookie-name", nftId, { path: "/" });
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
  //console.log("Gamescreen loading", tiles);

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

        <Toaster
          toastOptions={{
            className: styles.toaster,
            style: {},
          }}
        />

        {!isMobile && (
          <Row>
            <span className={styles.quotes}>{randomQuotes[randomQuoteId]}</span>
          </Row>
        )}
        <Row>
          {!isMobile && <Col xs={3}></Col>}
          <Col xs={12} lg={3}>
            <Row style={{ marginBottom: "1em" }}>
              <Accordion>
                <Accordion.Item
                  style={{ width: "fit-content", color: "black" }}
                  eventKey="0"
                >
                  <Accordion.Header>
                    {" "}
                    {characterId ? "Change" : "Choose"} NFT character.{" "}
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <input
                        type="number"
                        placeholder="nftId"
                        id="nftId"
                        defaultValue={characterId?.toString()}
                      ></input>
                    </Row>
                    <button onClick={selectNft} className={styles.pushable}>
                      <span className={styles.front}>select ID</span>
                    </button>
                    <div>or</div>
                    <button onClick={mintNft} className={styles.pushable}>
                      <span className={styles.front}> mint 1</span>
                    </button>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          </Col>
        </Row>

        {loading && (
          <Row>
            <Col xs={5}></Col>
            <Col xs={1}>
              <Spinner className={styles.spinner} animation="grow" />
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={12}>
            {character && (
              <Row>
                <Col xs={12} lg={3}>
                  <NftAvatar />
                </Col>
                <Col xs={12} lg={8}>
                  {character ? (
                    <CharacterBox
                      character={character}
                      spiceMined={spiceMined}
                      characterId={characterId}
                      toast={toast}
                      setTutorialStep={setTutorialStep}
                    />
                  ) : (
                    <img src={"/robot.gif"} className={styles.loadingGif} />
                  )}
                </Col>
              </Row>
            )}
          </Col>

          <Col>
            <Row>
              <div>{characters ? characters.length : "0"} players</div>
              Leaderboard
              {characters.slice(0, 3).map((c, i) => {
                return (
                  <div className={styles.events} key={i}>
                    {i === 0 && "🥇"} {i === 1 && "🥈"} {i === 2 && "🥉"} ⬪ #
                    {c.id} | lvl {c.lvl} | {c.spiceMined} $pice
                  </div>
                );
              })}
            </Row>
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
                characters={characters}
              />
            ) : (
              <MapPlaceholder length={DEFAULT_CHUNK_SIZE} />
            )}
          </Col>
          {character && (
            <Col xs={12} lg={4}>
              <ActionBox
                character={character}
                actions={actions}
                setActions={setActions}
                characterId={characterId}
                setLoading={setLoading}
                setOriginCoords={setOriginCoords}
              />
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default GameScreen;
