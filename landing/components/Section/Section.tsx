import { useEffect, useState, FunctionComponent, ReactNode } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Section.module.scss";

interface Props {
  Image?: string;
  Text: ReactNode;
  Button?: ReactNode;
  inverse: boolean;
  isMobile: boolean;
}

const Section: FunctionComponent<Props> = (props): JSX.Element => {
  let style: any;
  if (props.isMobile) {
    style = "column";
  } else {
    style = props.inverse ? "row-reverse" : "row";
  }

  return (
    <div className={styles.container}>
      <Row className={styles.contentContainer} style={{ flexDirection: style }}>
        {!props.isMobile ? (
          <>
            <div
              style={{
                width: "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={props.Image} />
            </div>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              {props.Text}
            </div>
          </>
        ) : (
          <>
            <div className="justify-content-center">
              <img src={props.Image} />
            </div>
            <div style={{ textAlign: "left" }}>{props.Text}</div>
          </>
        )}
      </Row>
      <Row className={styles.sectionFooter}>
        <div className={styles.rectangle1}></div>
        <img src="./pictures/testLogo.png" alt="testLogo" />
        <div className={styles.rectangle2}></div>
      </Row>
    </div>
  );
};

export default Section;
