import styles from "./GameScreen.module.scss";

import { Container, Row, Placeholder } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

interface Props {}

const NftAvatar: FunctionComponent<Props> = ({}): JSX.Element => {
  return (
    <>
      <div className={styles.avatarBox}>
        <img src="/ape_rust.jpeg" className={styles.avatarImg} />
      </div>
    </>
  );
};

export default NftAvatar;
