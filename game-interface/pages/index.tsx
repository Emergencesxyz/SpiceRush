import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "../components/ConnectWallet/ConnectWallet";
import SelectPlayer from "../components/SelectPlayer/SelectPlayer";
import Footer from "../components/Footer/Footer";
import { MoralisProvider } from "react-moralis";
import { useRouter } from "next/router";
import {
  injected,
  walletconnect,
  walletlink,
} from "../WalletHelpers/connectors";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const context = useWeb3React();
  const { account, library, connector, deactivate } = context;

  useEffect(() => {
    if (!!router.query?.disconnect) {
      if (connector === injected) {
        deactivate();
      } else {
        (connector as any).close();
      }
    }
  }, []);

  return (
    <MoralisProvider
      appId="4mKjTljUgN4ctOdYeOML5JV7at07qXEOXf8EBPGL"
      serverUrl="https://8kzhmqqwag9j.usemoralis.com:2053/server"
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
        <img src="assets/Group_25.png" alt="logo spicerush" />
        <div className={styles.connect}>
          <div className={styles.account}>
            <p>{account}</p>
            <img src="assets/canva_part1.png" alt="canvap1" />
          </div>
          {!!account && !!library ? <SelectPlayer /> : <ConnectWallet />}
          <img src="assets/canva_part2.png" alt="canvap2" />
        </div>

        <div className={styles.hexagons}></div>
        <Footer />
      </div>
    </MoralisProvider>
  );
}
