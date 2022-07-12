import styles from "./Footer.module.scss";
import { Row } from "react-bootstrap";

const Footer = (): JSX.Element => {
  return (
    <>
      <Row className={styles.footerRow2}>
        <p>Spice Rush ©2022 - Powered by Golem All rights reserved</p>
      </Row>
    </>
  );
};

export default Footer;
