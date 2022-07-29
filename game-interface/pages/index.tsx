import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "../components/ConnectWallet/ConnectWallet";
import SelectPlayer from "../components/SelectPlayer/SelectPlayer";
import SwitchNetwork from "../components/SwitchNetwork/SwitchNetwork";
import Footer from "../components/Footer/Footer";
import { MoralisProvider } from "react-moralis";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
import MintPlayer from "../components/MintPlayer/MintPlayer";
import BlockchainService from "../services/BlockchainService";

export default function Home() {
  const router = useRouter();
  const context = useWeb3React();
  const { account, library, connector, deactivate, chainId } = context;
  const [disconectUser, setDisconnectUser] = useState<boolean>(false);
  const [canMintNft, setCanMintNft] = useState<boolean>(false);
  const [isRightNetwork, setIsRightNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!!!account) return;
    (async () => {
      const blockchainService = new BlockchainService(account);
      setCanMintNft(await blockchainService.canMintNft(account));
    })();
  }, [account]);

  useEffect(() => {
    console.log("fddf", chainId == 80001);
    setIsRightNetwork(chainId == 80001);
  }, [chainId]);

  return (
    <MoralisProvider
      appId="0FyWwZYebDTaqJkBHnrSMjzwOMydOfTciapypNl5"
      serverUrl="https://qn0mjxe4gqks.usemoralis.com:2053/server"
    >
      <div
        className={styles.container}
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "60px",
        }}
      >
        <img src="assets/Group_25.png" alt="logo Spicerush" />
        <div className={styles.connect}>
          <div className={styles.account}>
            <p>{account}</p>
            <img src="assets/canva_part1.png" alt="canvap1" />
          </div>
          {!!account && !!library ? (
            isRightNetwork ? (
              <>
                {canMintNft && <MintPlayer />}
                <SelectPlayer />
              </>
            ) : (
              <SwitchNetwork />
            )
          ) : (
            <ConnectWallet />
          )}
          <img src="assets/canva_part2.png" alt="canvap2" />
        </div>

        <div className={styles.hexagons}></div>
        <Footer />
      </div>
    </MoralisProvider>
  );
}
