import { useEffect, useState, FunctionComponent, ReactNode } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Section.module.scss";

interface Props {
  Image?: string;
  Text: ReactNode;
  Button?: ReactNode;
  inverse: boolean;
  isMobile:boolean;
}

const Section: FunctionComponent<Props> = (props): JSX.Element => {
  let style: any;
  if(props.isMobile){
    style = "column";
  }else{
    style = props.inverse ? "row-reverse" :  "row"
  }

  return (
    <Row
      className={styles.container}
      style={{flexDirection: style }}
    >
      <Col className={styles.imageContainer}>
        <img src={props.Image} />
      </Col>
      <Col className={styles.text}>{props.Text}</Col>
    </Row>
  );
};

export default Section;
