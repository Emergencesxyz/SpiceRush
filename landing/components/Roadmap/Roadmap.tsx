import styles from "./Roadmap.module.scss";
import { Row, Col, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Chrono } from "react-chrono";

const Roadmap = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  return (
    <Container className={styles.container}>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Roadmap</h1>
      </Row>
      <Row className={styles.roadmap}>
        <Chrono
          /*           items={textRoadmap}
           */ mode={!isMobile ? "VERTICAL_ALTERNATING" : "VERTICAL"}
          hideControls
          /*           timelineCircleDimension="40"
           */ theme={{
            primary: "#fff",
            secondary: "#fff",
            cardBgColor: "#140E1E",
            /*             cardForeColor: "#fff",
             */
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>1 : Golem DAO</h2>
            <p>DAO Golem Token IEO</p>
            <p> Golem token listing </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>2 : Megalopolis Conquest</h2>
            <p> Lands auctions</p>
            <p> NFT Character drop</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>3 : Rise of the Apinator </h2>
            <p>Alpha release: mining economy and on-chain procedural map</p>

            <p>Big game contest </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>4 : Expansion </h2>
            <p>Beta release: Powerup items collection. PVP system.</p>
            <p>
              Develop partnerships with other NFT collections to integrate them
              in the Apeverse. NFT rent system.
            </p>
          </div>
        </Chrono>
      </Row>
    </Container>
  );
};

export default Roadmap;
