import styles from "./Footer.module.scss";
import { FunctionComponent } from "react";
import { Row, Col } from "react-bootstrap";
interface Props {
  isMobile: boolean;
}

const Footer: FunctionComponent<Props> = (props): JSX.Element => {
  const { isMobile } = props;
  return (
    <>
      <Row className={styles.footerRow1}>
        <Col className={styles.subRow}>
          <Col className={styles.links}>
            <a href="" target="_blank">
              Terms
            </a>
          </Col>
          <Col className={styles.links}>
            <a
              href="https://golemdao.gitbook.io/apinator-2042-by-golem/"
              target="_blank"
            >
              Whitepaper
            </a>
          </Col>
        </Col>
        <Col className={styles.subRow}>
          <Col className={styles.links}>
            <a href="https://twitter.com/Spice_Rush" target="_blank">
              Twitter
            </a>
          </Col>
          <Col className={styles.links}>
            <a href="https://t.me/apinator2042" target="_blank">
              Telegram
            </a>
          </Col>
        </Col>
      </Row>
      <Row className={styles.footerRow2}>
        {isMobile ? (
          <>
            <p>Apinators 2042 ©2021 - Powered by Golem</p>
            <p>All rights reserved</p>
          </>
        ) : (
          <p>Apinators 2042 ©2021 - Powered by Golem All rights reserved</p>
        )}
      </Row>
    </>
  );
};

export default Footer;
