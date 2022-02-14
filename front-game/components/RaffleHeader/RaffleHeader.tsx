import styles from "./RaffleHeader.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const Header: FunctionComponent = (): JSX.Element => {
  return (
    <>
      <div className={styles.title}>ARE YOU READY FOR THE RAFFLE</div>
      <div className={styles.subtitle}>
        connect your wallet down below 
      </div>
    </>
  );
};

export default Header;
