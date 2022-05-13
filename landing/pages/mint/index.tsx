import type { NextPage } from "next";
import styles from "../mint/mint.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Button, Table } from "react-bootstrap";
import Header from "../../components/Header/Header";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import Minter from "../../components/Minter/Minter";
import { useRouter } from "next/router";

const buyLand: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();
  const [referralCode, setReferralCode] = useState<any>("");
  const [secretCode, setSecretCode] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    setReferralCode(router.query?.number);
    setSecretCode(router.query?.secret);
  }, [chainId, account]);

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
                  <td colSpan={3} style={{ textAlign: "center", padding: "0" }}>
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
            {/*  <div
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
            </div> */}
            {/*  {isShown && (
              <div className={styles.explanation}>
                <ol>
                  <li>
                    The flat price for our gaming microchips is ...0 MATIC ! -
                    Mintable on polygon
                  </li>
                  <li>
                    By using a referral code you can get a 25 MATIC instantly
                    claimable cashback
                  </li>
                  <li> Minting also allows you to have a referral code</li>
                  <li>
                    Share your own referral code to your friends and the world
                    and get a 5 MATIC claimable reward for each mint
                  </li>
                </ol>
              </div>
            )} */}
          </>
        )}

        {!!account && library && (
          <Minter
            secretCode={secretCode}
            referralCode={referralCode}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

export default buyLand;
