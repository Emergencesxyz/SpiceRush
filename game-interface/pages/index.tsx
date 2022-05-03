import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "../components/ConnectWallet/ConnectWallet";
import SelectPlayer from "../components/SelectPlayer/SelectPlayer";
import { MoralisProvider } from "react-moralis";
import { useRouter } from 'next/router';
import { injected, walletconnect, walletlink } from "../WalletHelpers/connectors";
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
  }, [])

  return (
    <MoralisProvider
      appId="4mKjTljUgN4ctOdYeOML5JV7at07qXEOXf8EBPGL"
      serverUrl="https://8kzhmqqwag9j.usemoralis.com:2053/server"
    >
      <div className={styles.container} style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {!!account && !!library ? (
          <SelectPlayer />
        ) : (
          <ConnectWallet />
        )}
      </div>
    </MoralisProvider>
  );
}
