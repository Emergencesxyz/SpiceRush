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
  const { setCharacterInfo, setTiles, clearLogs } = gameContext;
  const [userNFTs, setUserNFTs] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const blockchainService = new BlockchainService(account);

  useEffect(() => {
    (async () => {
      if (!!account && !!library) {
        const getUserNFTs = await Web3Api.account.getNFTsForContract({
          chain: "mumbai",
          address: account,
          token_address: "0x680b20466bbc756E82Ce93d12E8179ecB688D9F5",
        });

        await fetchCharacterInfo(getUserNFTs.result);
        setLoading(false);
      }
    })();
  }, []);

  const fetchCharacterInfo = async (userNFTs: any) => {
    let characterInfo: any = [];
    for (let userNFT of userNFTs) {
      const _character = await blockchainService.getCharacterInfo(
        +userNFT.token_id
      );
      characterInfo.push(_character);
    }
    setUserNFTs(characterInfo);
  };

  const selectNFT = async (player: any) => {
    setCharacterInfo(player);

    //load character info
    // if (tiles && _character && Number.isInteger(_character.x)) {
    //   setSpiceMined(await blockchainService.getSpiceMined(characterId));
    // }

    clearLogs();
    Router.push("/game");
  };

  const ApeCards = () => {
    return userNFTs.map((e) => {
      return (
        <div key={e.id} onClick={() => selectNFT(e)} className={styles.apecard}>
          <Card className={styles.content}>
            <Card.Body
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "60%",
                }}
              >
                <img src="/assets/nft.png" alt="nft ape" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <span># {e.id}</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        color: "#0ABDC6",
                      }}
                    >
                      <span>Lvl</span>
                      <span style={{ fontSize: "22px" }}> {e.lvl}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "left",
                      }}
                    >
                      <div>
                        <span style={{ paddingRight: "5px" }}>
                          <img src="/assets/xp.png" alt="xp" style={{ height: "18px" }} />
                        </span>
                        <span> {e.xp}/3000</span>
                      </div>
                      <div>
                        <span style={{ paddingRight: "5px" }}>
                          <img src="/assets/position.svg" alt="pos" />
                        </span>
                        <span>
                          [{e.x},{e.y}]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  height: "40%",
                }}
              >
                <img src="/assets/ic_spice_ore.png" alt="spice ore" />
                <div>
                  <p>Spice Ore:</p>
                  <h3>{e.spiceMined}</h3>
                </div>
              </div>
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
        alignItems: "center",
        justifyContent: "center",
        padding: "50px",
      }}
    >
      {loading ? (
        <Spinner animation="border" style={{ color: "white" }} />
      ) : (
        <>

          {ApeCards()}
        </>
      )
      }
    </div>
  );
};

export default SelectPlayer;
