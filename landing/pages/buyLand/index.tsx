import type { NextPage } from "next";
import styles from "../buyLand/buyLand.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Col, Button, InputGroup, Form, Table } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import CardBody from "../../components/Card/Card";

const buyLand: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { account, library } = useWeb3React();
  //zbiz
  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

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
            <div>
              <Button className={styles.button1}>MINT</Button>
            </div>

            <div>
              <Table className={styles.table}>
                <tbody>
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center" }}>
                      <strong>ApeX6</strong> Microchips
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center" }}>
                      <img src="/pictures/microchip_side_1.png" alt="chip" />
                    </td>
                  </tr>
                  <tr>
                    <td>Referral Code*</td>
                    <td style={{ textAlign: "right" }}>2389</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td style={{ textAlign: "right" }}>1</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td style={{ textAlign: "right" }}>25 MATIC</td>
                  </tr>
                  <span style={{ color: "red", fontSize: "13px" }}>
                    *5 MATIC Instant claimable cashback per NFT
                  </span>
                </tbody>
              </Table>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <CardBody
                header={
                  <Row className="d-flex flex-row">
                    <h1> REFERRALS CASHBACK</h1>
                  </Row>
                }
                subtitle={
                  <Row className="d-flex flex-row">
                    <span style={{ color: "red", fontSize: "20px" }}>
                      Share your referral link to get a 5 MATIC reward for each
                      mint !
                    </span>
                  </Row>
                }
                textTitle1={
                  <>
                    <h2>5 MATIC</h2>
                    <p>available cashback</p>
                  </>
                }
                textTitle2={
                  <>
                    <h2>2974</h2>
                    <p>your referral code</p>
                  </>
                }
                textSubtitle2={<p>your referral link</p>}
                buttonTitle1="CLAIM"
                buttonTitle2="SHARE"
                footer={
                  <p>
                    You referred <span style={{ fontSize: "30px" }}>10</span>{" "}
                    mints
                  </p>
                }
              />
            </div>
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
