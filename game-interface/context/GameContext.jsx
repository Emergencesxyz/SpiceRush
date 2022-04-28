import React, { createContext, useState } from "react";

export const GameContext = createContext();

const GameContextProvider = (props) => {
  const [playerDirection, setPlayerDirection] = useState(0);
  const [characterInfo, setCharacterInfo] = useState(0);
  const [tiles, setTiles] = useState([]);

  return (
    <GameContext.Provider
      value={{
        playerDirection,
        setPlayerDirection,
        characterInfo,
        setCharacterInfo,
        tiles,
        setTiles
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
