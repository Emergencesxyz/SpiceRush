import styles from "./Footer.module.scss";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <Row className={styles.footerRow1}>
        <Col style={{ display: "flex", flexDirection: "row" }}>
          <Col
            md={2}
            style={{
              display: "flex",
              flexDirection: "column",
              paddingRight: "40%",
              lineHeight: "40px",
            }}
          >
            <a href="" target="_blank">
              Terms
            </a>
          </Col>
          <Col>
            <a
              href="https://metapolis.gitbook.io/apinator-2042-v1/"
              target="_blank"
            >
              Whitepaper
            </a>
          </Col>
          <Col>
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
