import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
import { GameContext } from "../../context/GameContext";
import Header from "../../components/Header/Header";
import Player from "../../components/Player/Player";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import { testTiles } from "../../borrar";
import LandSection from "../../components/LandSection/LandSection";

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
      setTiles(testTiles);
      setLoading(false);
    })()
  }, [])

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <Header />

      <LandSection />

      <div style={{ display: "flex" }}>
        <Player />

        <div style={{ border: "1px solid red", width: "800px", height: "600px" }}>
          {loading ? (
            <h1>creating map from blockchain</h1>
          ) : (
            <Map />
          )}
        </div>
      </div>
    </div>
  )
}
