import styles from "./Footer.module.scss";
import { Row } from "react-bootstrap";

const Footer = (): JSX.Element => {
  return (
    <>
      <Row className={styles.footerRow2}>
        <p>Apinators 2042 ©2021 - Powered by Golem All rights reserved</p>
      </Row>
    </>
  );
};

export default Footer;
