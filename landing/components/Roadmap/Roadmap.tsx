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
       }}
      >
        <h1>
          Roadmap
        </h1>
      </Row>
      <Row className={styles.roadmap}>
        <Chrono
          /*           items={textRoadmap}
           */ mode= {!isMobile ? "VERTICAL_ALTERNATING" : "VERTICAL"}
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
            <h2>1 : Rise of the Apinator</h2>
            <p>Alpha release: mining economy and on-chain procedural map</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>2 : A new hope</h2>
            <p>Beta release: Powerup items collection. PVP system.</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>3 : Expansion of the Apeverse</h2>
            <p>
              Develop partnerships with other NFT collections to integrate them
              in the Apeverse. NFT rent system.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "80%",
            }}
          >
            <h2>4 : Into the Metaverse</h2>
            <p>Expand Apeverse to a fully 3D metaverse.</p>
          </div>
        </Chrono>
      </Row>
    </Container>
  );
};

export default Roadmap;
