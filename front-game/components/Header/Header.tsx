import styles from "./Header.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const Header: FunctionComponent = (): JSX.Element => {
  return (
    <>
      <div className={styles.title}>APINATOR 2042</div>
      <div className={styles.subtitle}>ON-CHAIN APEOCALYPTIC YIELD GAME.</div>
    </>
  );
};

export default Header;
