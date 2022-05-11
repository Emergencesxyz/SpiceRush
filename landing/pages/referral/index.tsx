import type { NextPage } from "next";
import styles from "../referral/referral.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Button, Table, Dropdown } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import Minter from "../../components/Minter/Minter";
import MinterTestnet from "../../components/MinterTestnet/MinterTestnet";
import { provider } from "../../WalletHelpers/contractVariables";
import Web3 from "web3";
import { useRouter } from "next/router";

declare global {
  interface Window {
    ethereum: any;
  }
}

const buyLand: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<any>("");
  const web3 = new Web3(provider);
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    chainId == 80001 ? setIsTestnet(true) : setIsTestnet(false);
    setReferralCode(router.query?.number);
  }, [chainId, account]);

  async function addNetwork(type: any) {
    if (typeof web3 !== "undefined") {
      let network: any = 0;
      network = chainId;
      let netID = network.toString();
      let params;
      if (netID == "80001") {
        params = [
          {
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com/"],
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ];
      } else {
        {
          params = [
            {
              chainId: "0x13881",
              chainName: "Polygon Mumbai",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ];
        }
      }

      if (!window.ethereum) {
        alert("No crypto wallet found");
        return;
      }
      window.ethereum
        .request({ method: "wallet_addEthereumChain", params })
        .then(() => console.log("Success"))
        .catch((error: any) => console.log("Error", error.message));
    } else {
      alert("Unable to locate a compatible web3 browser!");
    }
  }

  return (
    <>
      <header>
        <Header isMobile={isMobile} />
      </header>
      <div className={styles.container}>
        <div className={styles.connectWallet}>
          <ConnectWallet />
        </div>
        {!!account && library && (
          <>
            <div className={styles.buttonContainer}>
              <Button
                className={styles.button1}
                onClick={() => addNetwork(web3)}
              >
                {isTestnet ? (
                  <span>Switch to mainnet</span>
                ) : (
                  <span>Switch to testnet</span>
                )}
              </Button>
              <div className={styles.rectangle1}></div>
            </div>
            {/*  {isTestnet ? <MinterTestnet /> : <Minter />} */}
            <Minter referralCode={referralCode} />
          </>
        )}
      </div>
      <div className={styles.footer}>
        <Footer isMobile={isMobile} />
      </div>
    </>
  );
};

export default buyLand;
