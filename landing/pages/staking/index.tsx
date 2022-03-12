import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

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
      <div style={{ height: "100vh" }}></div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Staking;
