import type { NextPage } from "next";
import styles from "../buyLand/buyLand.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Col, Button, InputGroup, Form } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import CardBody from "../../components/Card/Card";

const buyLand: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { account } = useWeb3React();
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
        <h1>CHIPS</h1>
        <div className={styles.connectWallet}>
          <ConnectWallet />
        </div>
        {!!account && (
          <>
            <div>
              <InputGroup>
                <Form.Control
                  placeholder="referral"
                  aria-label="referral"
                  aria-describedby="referral"
                  className={styles.noBorder}
                />
              </InputGroup>
              <Button className={styles.button1}>MINT</Button>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <h1>COLLECTED CHIPS</h1>
            </div>
            <div style={{ marginBottom: "30px" }}>
              <CardBody
                header={
                  <>
                    {/*  <Row className="d-flex flex-row">
                      <div style={{ width: "30%" }}>
                        <span>#53</span>
                      </div>
                      <div style={{ width: "40%" }}>
                        <span>LEVEL 2</span>
                      </div>
                      <div style={{ width: "30%" }}>
                        <span>[0;1]</span>
                      </div>
                    </Row>
                    <Row className="d-flex flex-row">
                      <div style={{ width: "30%" }}>
                        <span>ID</span>
                      </div>
                      <div style={{ width: "40%" }}>
                        <span></span>
                      </div>
                      <div style={{ width: "30%", fontSize: "17px" }}>
                        <span>location</span>
                      </div>
                    </Row> */}
                  </>
                }
                text={
                  <>
                    <h2>ID:</h2>
                    {/* <p>Current APY</p> */}
                  </>
                }
                Image="../pictures/lands.gif"
                buttonTitle1="CLAIM REWARD"
                buttonTitle2="BUILD"
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
