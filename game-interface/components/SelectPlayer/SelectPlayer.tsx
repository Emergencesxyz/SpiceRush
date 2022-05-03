import { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Col,
  Button,
  Dropdown,
  Spinner,
  Modal,
  Card,
  ListGroup,
} from "react-bootstrap";
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
          token_address: "0x680b20466bbc756E82Ce93d12E8179ecB688D9F5",
        });

        setUserNFTs(getUserNFTs?.result);
      }
    })();
  }, []);

  const selectNFT = async (id: string) => {
    const _character = await blockchainService.getCharacterInfo(+id);

    console.log("info", _character);
    setCharacterInfo(_character);

    //load character info
    // if (tiles && _character && Number.isInteger(_character.x)) {
    //   setSpiceMined(await blockchainService.getSpiceMined(characterId));
    // }

    Router.push("/game");
  };

  const ApeCards = () => {
    return userNFTs.map((e) => {
      return (
        <div
          key={e.token_id}
          onClick={() => selectNFT(e.token_id)}
          className={styles.apecard}
        >
          <Card className={styles.content}>
            <Card.Body style={{ width: "100%" }}>
              <Card.Text>
                <img src="/assets/nft.png" alt="nft ape" /># {e.token_id}
              </Card.Text>
              <Card.Link href="#">Life points: </Card.Link>
              <Card.Text
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <img src="/assets/ic_spice_ore.png" alt="spice ore" />
                <div>
                  <p>Spice Ore:</p>
                  <h3>230039</h3>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "50px",
      }}
    >
      {/* <h1>{account}</h1> */}
      {ApeCards()}
    </div>
  );
};

export default SelectPlayer;
