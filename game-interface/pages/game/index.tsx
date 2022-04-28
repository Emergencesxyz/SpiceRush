import { useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
import { GameContext } from "../../context/GameContext";
import Header from "../../components/Header/Header";
import Player from "../../components/Player/Player";

const Map = dynamic(() => import("../../components/Map/Map"), {
  ssr: false,
});

export default function Game() {
  const gameContext = useContext(GameContext);
  const { playerDirection, characterInfo } = gameContext;

  useEffect(() => {
    console.log('character info', characterInfo);
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

      <div style={{ display: "flex" }}>
        <Player />

        <div style={{ border: "1px solid red", width: "800px", height: "600px" }}>
          <Map
            playerDirection={playerDirection}
          />
        </div>
      </div>
    </div>
  )
}
