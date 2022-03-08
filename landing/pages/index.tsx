import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Presentation from "../components/Presentation/Presentation";
import Section from "../components/Section/Section";
import textSection from "../components/textSection";
import Footer from "../components/Footer/Footer";
import Roadmap from "../components/Roadmap/Roadmap";
import Header from "../components/Header/Header";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";

const Home: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const [isActive1, setIsActive1] = useState<boolean>(false);
  const [isActive2, setIsActive2] = useState<boolean>(false);
  const [isActive3, setIsActive3] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const animation = useAnimation();

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    if (inView) {
      console.log("use effect hook, inView =", inView);
      animation.start({
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 2,
          bounce: 0.3,
        },
      });
    } else {
      animation.start({ y: "20%", opacity: 0 });
    }
  }, [inView]);

  const video = useMemo(() => {
    return <Presentation isMobile={isMobile} />;
  }, [isMobile]);

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
          <Header isMobile={isMobile} />
        </header>
      }
      <div style={{ width: "100%", position: "relative" }}>{video}</div>
      <section ref={ref}>
        <motion.div
          style={{ marginTop: "8vh", marginBottom: "12vh" }}
          animate={animation}
        >
          <Section
            inverse={false}
            isMobile={isMobile}
            Image="./pictures/Image95.png"
            Text={
              <>
                <h1>{textSection.section1.title}</h1>
                <p>{textSection.section1.part1}</p>
                <p>{textSection.section1.part2}</p>
                {/* <p>{textSection.section1.part3}</p> */}

                <a
                  href="https://app.gitbook.com/o/OFYOnJLAwXIhyBYEPiBv/s/BZgaWwUM4ZlgP3Auovdb/ecosystem/dao"
                  target="_blank"
                >
                  <Button
                    className={styles.button}
                    /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} 
                onClick={() => setIsActive1(true)}*/
                  >
                    more
                  </Button>
                </a>
                {/*   {isActive1 && <h1>SOON</h1>} */}
              </>
            }
          />
        </motion.div>
        <motion.div
          style={{ marginTop: "12vh", marginBottom: "12vh" }}
          animate={animation}
        >
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
                <a
                  href="https://metapolis.gitbook.io/apinator-2042-v1/ecosystem/staking#land-autostaking"
                  target="_blank"
                >
                  <Button
                    className={
                      styles.button
                    } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} 
                onClick={() => setIsActive2(true)}*/
                  >
                    more
                  </Button>
                </a>
                {/* {isActive2 && <h1>SOON</h1>} */}
              </>
            }
          />
        </motion.div>
        <motion.div
          style={{ marginTop: "12vh", marginBottom: "12vh" }}
          animate={animation}
        >
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
                <a
                  href="https://app.gitbook.com/o/OFYOnJLAwXIhyBYEPiBv/s/BZgaWwUM4ZlgP3Auovdb/gameplay/spice"
                  target="_blank"
                >
                  <Button
                    className={
                      styles.button
                    } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} 
                onClick={() => setIsActive3(true)}*/
                  >
                    more
                  </Button>
                </a>
                {/*  {isActive3 && <h1>SOON</h1>} */}
              </>
            }
          />
        </motion.div>
        <motion.div
          style={{ marginTop: "12vh", marginBottom: "12vh" }}
          animate={animation}
        >
          <Section
            inverse={true}
            isMobile={isMobile}
            Image="../pictures/Carte_teaser_chiffres400.gif"
            Text={
              <>
                <h1>{textSection.section4.title}</h1>
                <p>{textSection.section4.part1}</p>
                <p>{textSection.section4.part2}</p>
                <p>{textSection.section4.part3}</p>
                <a
                  href="https://app.gitbook.com/o/OFYOnJLAwXIhyBYEPiBv/s/BZgaWwUM4ZlgP3Auovdb/gameplay/character-stats"
                  target="_blank"
                >
                  <Button
                    className={
                      styles.button
                    } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} 
                onClick={() => setIsActive(true)} */
                  >
                    more
                  </Button>
                </a>
              </>
            }
          />
        </motion.div>
      </section>
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
