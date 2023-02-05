import { useWeb3React } from "@web3-react/core";
import { injected } from "../../WalletHelpers/connectors";

import styles from "./Header.module.scss";
import Router from "next/router";
import { Col } from "react-bootstrap";
import { useEffect, useState } from "react";

const Header = (): JSX.Element => {
  const context = useWeb3React();
  const { account, deactivate, connector } = context;

  useEffect(() => {
    if (!!!account) Router.push("/");
  }, [account]);

  const killSession = () => {
    if (connector === injected) {
      deactivate();
    } else {
      (connector as any).close();
    }

    // Router.push({
    //     pathname: "/",
    //     query: { disconnect: true },
    // })
  };

  return (
    <div className={styles.container}>
      <Col md={2} className={styles.brand}>
        <img src="/assets/logo_sr.svg" alt="spice rush logo" />
      </Col>

      <Col className={styles.account}>
        <img
          src="/assets/sr_Icon.png"
          alt="spice rush icon"
          className={styles.icon}
        />
        <p>{account}</p>
        <img src="/assets/header_graph.png" alt="spice rush header" />
      </Col>

      <Col md={2} className={styles.buttons}>
        <div className={styles.button} onClick={() => Router.push("/")}>
          <img src="/assets/button_off.png" alt="change character" />
          <p>change character</p>
        </div>
        <div className={styles.button} onClick={() => killSession()}>
          <img src="/assets/button_on.png" alt="disconnect" />
          <p>disconnect</p>
        </div>
      </Col>
    </div>
  );
};

export default Header;
