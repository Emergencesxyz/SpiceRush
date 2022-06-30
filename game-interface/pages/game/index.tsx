import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/Home.module.scss";
import { GameContext } from "../../context/GameContext";
import Header from "../../components/Header/Header";
import Player from "../../components/Player/Player";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";
import LandSection from "../../components/LandSection/LandSection";
import { Col } from "react-bootstrap";
import LogScreen from "../../components/LogScreen/LogScreen";
import ListPlayers from "../../components/ListPlayers/ListPlayers";
import { Spinner } from "react-bootstrap";
import { testTiles } from "../../borrar"

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
      const getTiles = await blockchainService.getMapPlayer(characterInfo.x, characterInfo.y, 10);
      setTiles(getTiles);
      setLoading(false);
    })()
  }, [])

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.playZone}>
        <Col md={4}>
          <Player />
          <div style={{ paddingLeft: "70px", paddingRight: "10px" }}>
            <LogScreen />
          </div>
        </Col>


        {loading ? (
          <Col md={4} style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", flexDirection: "column" }}>
            <h1>creating map from blockchain</h1>
            <Spinner animation="border" style={{ color: "white" }} />
          </Col>
        ) : (
          <Col md={4}>
            <div style={{ minHeight: "670px" }}>
              <Map />
            </div>
          </Col>
        )}

        <Col md={4}>
          <LandSection />
          <ListPlayers />
        </Col>
      </div>
    </div>
  )
}
