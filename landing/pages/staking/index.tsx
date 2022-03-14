import type { NextPage } from "next";
import styles from "../staking/staking.module.scss";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import CardBody from "../../components/Card/Card";

const Staking: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);

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
        <div>
          <ConnectWallet />
        </div>
        <div>
          <CardBody header={<p>test</p>} text={<p>test</p>} />
        </div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </>
  );
};

export default Staking;
