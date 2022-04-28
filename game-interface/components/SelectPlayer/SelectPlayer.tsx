import { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Col, Button, Dropdown, Spinner, Modal } from "react-bootstrap";
import styles from "./SelectPlayer.module.scss";
import { useMoralisWeb3Api } from "react-moralis";
import Router from "next/router";
import { GameContext } from "../../context/GameContext";
import BlockchainService from "../../services/BlockchainService";

// for testing
import { testTiles } from "../../borrar";



const SelectPlayer = () => {
  const Web3Api = useMoralisWeb3Api();
  const context = useWeb3React();
  const { account, library } = context;
  const gameContext = useContext(GameContext);
  const { setCharacterInfo, setTiles } = gameContext;
  const [userNFTs, setUserNFTs] = useState([]);
  const blockchainService = new BlockchainService(account);

  useEffect(() => {
    (async () => {
      if (!!account && !!library) {
        const getUserNFTs = await Web3Api.account.getNFTsForContract({
          chain: "mumbai",
          address: account,
          token_address: '0x680b20466bbc756E82Ce93d12E8179ecB688D9F5',
        });

        setUserNFTs(getUserNFTs?.result);
      }
    })();
  }, []);

  const selectNFT = async (id: string) => {
    const _character = await blockchainService.getCharacterInfo(+id);

    console.log('info', _character)
    setCharacterInfo(_character);

    // Getting tiles
    // const tiles = await blockchainService.getMapChunk(_character.x, _character.y, 10);
    //setTiles(testTiles);


    //load character info
    // if (tiles && _character && Number.isInteger(_character.x)) {
    //   setSpiceMined(await blockchainService.getSpiceMined(characterId));
    // }

    Router.push("/game")
  }

  const ApeCards = () => {
    return userNFTs.map((e) => {
      return (
        <div
          key={e.token_id}
          onClick={() => selectNFT(e.token_id)}
          style={{
            height: "300px",
            width: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid",
            cursor: "pointer"
          }}
        >
          # {e.token_id}
        </div>
      )
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>{account}</h1>
      {ApeCards()}
    </div>
  );
};

export default SelectPlayer;
