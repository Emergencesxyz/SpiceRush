import styles from "./Footer.module.scss";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <Row className={styles.footerRow1}>
        <Col style={{ display: "flex", flexDirection: "row", width: "80%" }}>
          <Col className={styles.links}>
            <a href="" target="_blank">
              Terms
            </a>
          </Col>
          <Col className={styles.links}>
            <a
              href="https://metapolis.gitbook.io/apinator-2042-v1/"
              target="_blank"
            >
              Whitepaper
            </a>
          </Col>
          <Col className={styles.links}>
            <a href="" target="_blank">
              Twitter
            </a>
          </Col>
          {/*
          <Col
            md={2}
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "40px",
            }}
          >
            <a href="" target="_blank">
              Staking
            </a>
            <a href="" target="_blank">
              Token
            </a>
          </Col>
            */}
        </Col>
      </Row>
      <Row className={styles.footerRow2}>
        Apinators 2042 ©2021 - Powered by Golem - All rights reserved
      </Row>
    </>
  );
};

export default Footer;
