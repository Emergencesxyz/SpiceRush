import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Presentation from "../components/Presentation/Presentation";
import Section from "../components/Section/Section";
import textSection from "../components/textSection";
import Footer from "../components/Footer/Footer";
import Roadmap from "../components/Roadmap/Roadmap";
import Header from "../components/Header/Header";

const Home: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      {
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            zIndex: 10,
          }}
        >
          <Header />
        </header>
      }
      <div style={{ width: "100%", position: "relative" }}>
        <Presentation />
      </div>
      <div style={{ marginTop: "12vh", marginBottom: "12vh" }}>
        <Section
          inverse={false}
          isMobile={isMobile}
          Image="./pictures/baseball_cap_gradient.png"
          Text={
            <>
              <h1>{textSection.section1.title}</h1>
              <p>{textSection.section1.part1}</p>
              <p>{textSection.section1.part2}</p>
              {/* <p>{textSection.section1.part3}</p> */}

              <Button
                className={styles.button}
                /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} */
                onClick={() => setIsActive(true)}
              >
                <a
                  href="https://app.gitbook.com/o/OFYOnJLAwXIhyBYEPiBv/s/BZgaWwUM4ZlgP3Auovdb/ecosystem/dao"
                  target="_blank"
                >
                  more
                </a>
              </Button>
              {isActive && <h1>SOON</h1>}
            </>
          }
        />
      </div>
      <div style={{ marginTop: "12vh", marginBottom: "12vh" }}>
        <Section
          inverse={true}
          isMobile={isMobile}
          Image="../pictures/iso_city_1.png"
          Text={
            <>
              <h1>{textSection.section2.title}</h1>
              <p>{textSection.section2.part1}</p>
              <p>{textSection.section2.part2}</p>
              <p>{textSection.section2.part3}</p>
              <Button
                className={
                  styles.button
                } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} */
                onClick={() => setIsActive(true)}
              >
                <a
                  href="https://metapolis.gitbook.io/apinator-2042-v1/ecosystem/staking#land-autostaking"
                  target="_blank"
                >
                  more
                </a>
              </Button>
              {isActive && <h1>SOON</h1>}
            </>
          }
        />
      </div>
      <div style={{ marginTop: "12vh", marginBottom: "12vh" }}>
        <Section
          inverse={false}
          isMobile={isMobile}
          Image="../pictures/crystal.png"
          Text={
            <>
              <h1>{textSection.section3.title}</h1>
              <p>{textSection.section3.part1}</p>
              <p>{textSection.section3.part2}</p>
              <p>{textSection.section3.part3}</p>
              <Button
                className={
                  styles.button
                } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} */
                onClick={() => setIsActive(true)}
              >
                <a
                  href="https://app.gitbook.com/o/OFYOnJLAwXIhyBYEPiBv/s/BZgaWwUM4ZlgP3Auovdb/gameplay/spice"
                  target="_blank"
                >
                  more
                </a>
              </Button>
              {isActive && <h1>SOON</h1>}
            </>
          }
        />
      </div>
      <div style={{ marginTop: "12vh", marginBottom: "12vh" }}>
        <Section
          inverse={true}
          isMobile={isMobile}
          Image="../pictures/Carte teaser chiffres400.gif"
          Text={
            <>
              <h1>{textSection.section4.title}</h1>
              <p>{textSection.section4.part1}</p>
              <p>{textSection.section4.part2}</p>
              <p>{textSection.section4.part3}</p>
              <Button
                className={
                  styles.button
                } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} */
                onClick={() => setIsActive(true)}
              >
                <a
                  href="https://app.gitbook.com/o/OFYOnJLAwXIhyBYEPiBv/s/BZgaWwUM4ZlgP3Auovdb/gameplay/character-stats"
                  target="_blank"
                >
                  more
                </a>
              </Button>
            </>
          }
        />
      </div>
      <div>
        <Roadmap />
      </div>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
