import type { NextPage } from "next";
import styles from "../staking/staking.module.scss";
import { useEffect, useState, FunctionComponent, ReactNode } from "react";
import { Button, Card } from "react-bootstrap";

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
    <Card style={{ width: "18rem" }}>
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
