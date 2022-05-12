import type { NextPage } from "next";
import styles from "../mint/mint.module.scss";
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
  const [isShown, setIsShown] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    /* chainId == 80001 ? setIsTestnet(true) : setIsTestnet(false); */
    setReferralCode(router.query?.number);
  }, [chainId, account]);

  console.log(isShown);

  /* async function addNetwork(type: any) {
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
  } */

  return (
    <div className={styles.body}>
      <header>
        <Header isMobile={isMobile} />
      </header>
      <div className={styles.container}>
        <div className={styles.connectWallet}>
          <ConnectWallet isMobile={isMobile} />
        </div>

        {!!!account && (
          <>
            <Table className={styles.table}>
              <tbody>
                <tr>
                  <td colSpan={3} style={{ fontSize: "30px" }}>
                    <strong>APEx7</strong> Microchips
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    {/*  <img src="/pictures/microchip_side_1.png" alt="chip" /> */}
                    <img src="/pictures/microchip.gif" alt="chip" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <em>
                      Minting gets you exclusive access to the Game Beta and
                      earns 5 MATIC rewards for each referral mint.
                    </em>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>How it works</p>
                    <div style={{ textAlign: "left" }}>
                      <ol>
                        <li>Mint your chip</li>
                        <li> Claim your cashback</li>
                        <li> Share your link</li>
                        <li>Claim your rewards</li>
                      </ol>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
              }}
              onClick={() => setIsShown(!isShown)}
            >
              <span>
                <em>I'm new to all of this...</em>
              </span>
              <img
                style={{
                  width: "16px",
                  height: "16px",
                  marginTop: "5px",
                }}
                src="/pictures/Polygon3.png"
                alt="polygon"
              ></img>
            </div>
            {isShown && (
              <div className={styles.explanation}>
                <ol>
                  <li>
                    The flat price for our gaming microchips is 25 MATIC -
                    Mintable on polygon
                  </li>
                  <li>
                    By using a referral code you can get a 5 MATIC instantly
                    claimable cashback
                  </li>
                  <li> Minting also allows you to have a referral code</li>
                  <li>
                    Share your own referral code to your friends and the world
                    and get a 5 MATIC claimable reward for each mint
                  </li>
                </ol>
              </div>
            )}
          </>
        )}

        {!!account && library && (
          <>
            <div className={styles.text}>
              <span>
                Mainnet: Get exclusive access to Beta-Mainnet and earn cashback
                from your referrals.{" "}
              </span>
              <span>
                Testnet: Get early access to Alpha-Testnet for free. Click here
                to get testnet MATIC for transaction.
              </span>
              <span>
                lien :{" "}
                <a
                  href="https://faucet.polygon.technology/"
                  target="_blank"
                  className={styles.faucetLink}
                >
                  <u>https://faucet.polygon.technology/</u>
                </a>
              </span>
            </div>
            {/*  <div className={styles.buttonContainer}>
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
            </div> */}
            <Minter referralCode={referralCode} />
          </>
        )}
      </div>
      {/* <div className={styles.footer}>
        <Footer isMobile={isMobile} />
      </div> */}
    </div>
  );
};

export default buyLand;
