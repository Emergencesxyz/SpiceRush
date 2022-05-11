import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/Home.module.scss";
import { GameContext } from "../../context/GameContext";
import Header from "../../components/Header/Header";
import Player from "../../components/Player/Player";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import { testTiles } from "../../borrar";
import LandSection from "../../components/LandSection/LandSection";
import { Col } from "react-bootstrap";
import LogScreen from "../../components/LogScreen/LogScreen";
import ListPlayers from "../../components/ListPlayers/ListPlayers";

const Map = dynamic(() => import("../../components/Map/Map"), {
  ssr: false,
});

export default function Game() {
  const context = useWeb3React();
  const { account } = context;
  const gameContext = useContext(GameContext);
  const { playerDirection, characterInfo, tiles, setTiles } = gameContext;
  const blockchainService = new BlockchainService(account);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      console.log('getting tiles')
      // const tiles = await blockchainService.getMapPlayer(characterInfo.x, characterInfo.y, 10);
      // setTiles(tiles);
      setTiles(testTiles);
      setLoading(false);
    })()
  }, [])

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.playZone}>
        <Col md={4}>
          <Player />
        </Col>

        <Col md={4}>
          {loading ? (
            <h1>creating map from blockchain</h1>
          ) : (
            <>
              <div style={{ minHeight: "670px" }}>
                <Map />
              </div>
              <LogScreen />
            </>
          )}
        </Col>

        <Col md={4}>
          <LandSection />
          <ListPlayers />
        </Col>
      </div>
    </div>
  )
}
