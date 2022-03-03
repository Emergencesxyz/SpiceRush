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
            <a href="">Terms</a>
            <a href="">Whitepaper</a>
          </Col>
          <Col
            md={2}
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "40px",
            }}
          >
            <a href="">Staking</a>
            <a href="">Token</a>
          </Col>
        </Col>
        <Col
          md={2}
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: "40px",
            paddingRight: "10%",
          }}
        >
          <a href="">Discord</a>
          <a href="">Twitter</a>
        </Col>
      </Row>
      <Row className={styles.footerRow2}>
        Apinators 2042 - Powered by Golem - All rights reserved
      </Row>
    </>
  );
};

export default Footer;
