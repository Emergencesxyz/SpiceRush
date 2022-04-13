import React, { useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import styles from "../RoadmapV2/RoadmapV2.module.scss";

const Roadmapv2 = () => {
  return (
    <Container className={styles.container}>
      <Row className={styles.title}>Roadmap</Row>
      <Row className={styles.content}>
        <div className={styles.image}>
          <img src="../pictures/Roadmap.svg" />
        </div>
        <div className={styles.text}>
          <div className={styles.block}>
            <h2>Singularity</h2>
            <p>MVP </p>
            <p> Team </p>
          </div>
          <div className={styles.block}>
            <h2>Megalopolis Conquest</h2>
            <p> Alpha release testnet </p>
            <p> Game contest </p>
          </div>
          <div className={styles.block}>
            <h2>Rise of the Apinator </h2>
            <p>NFT Sale </p>
            <p>Beta release mainnet</p>
            <p>Big game contest </p>
          </div>
          <div className={styles.block}>
            <h2>Expansion </h2>
            <p>DAO Launch</p>
            <p>SRG token listing </p>
            <p>Item collection</p>
            <p>Improved PVP</p>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Roadmapv2;
