import type { NextPage } from "next";
import styles from "../staking/staking.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Col, Button } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import CardBody from "../../components/Card/Card";

const Staking: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { account, library } = useWeb3React();

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
        <h1>STAKING</h1>
        <div className={styles.connectWallet}>
          <ConnectWallet />
        </div>
        {!!account && !!library && (
          <>
            <div style={{ marginBottom: "30px" }}>
              <CardBody
                header={<p>Stake GOLEM → Earn GOLEM</p>}
                text={
                  <>
                    <h2>2888%</h2>
                    <p>Current APY</p>
                  </>
                }
                buttonTitle1="STAKE"
              />
            </div>
            <div>
              <CardBody
                header={<p>Stake GOLEM → Earn GOLEM</p>}
                text={
                  <>
                    <h2>2888%</h2>
                    <p>Current APY</p>
                  </>
                }
                buttonTitle1="STAKE"
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </>
  );
};

export default Staking;
