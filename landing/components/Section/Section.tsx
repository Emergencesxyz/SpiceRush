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
    <Row className={styles.container} style={{ flexDirection: style }}>
      {!props.isMobile ? (
        <>
          <div
            style={{
              width: "40%",
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
              width: "60%",
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
  );
};

export default Section;
