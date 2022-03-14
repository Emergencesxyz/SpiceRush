import type { NextPage } from "next";
import { useEffect, useState, FunctionComponent, ReactNode } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "../Card/Card.module.scss";

interface Props {
  header: ReactNode;
  text: ReactNode;
  Image?: string;
  buttonTitle1?: string;
  buttonTitle2?: string;
}

const CardBody: FunctionComponent<Props> = (props) => {
  const { header, text, Image, buttonTitle1, buttonTitle2 } = props;
  return (
    <Card /* className={styles.card} */>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{header}</Card.Title>
        <Card.Text>{text}</Card.Text>
        {Image && <img src={Image}></img>}
        <Button variant="primary">{buttonTitle1}</Button>
        {buttonTitle2 && <Button variant="primary">{buttonTitle2}</Button>}
      </Card.Body>
    </Card>
  );
};

export default CardBody;
