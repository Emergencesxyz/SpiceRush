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
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title className={styles.header}>{header}</Card.Title>
        <Card.Text className={styles.text}>{text}</Card.Text>
        {Image && <Card.Img variant="top" src={Image} />}
        <Button className={styles.button1}>{buttonTitle1}</Button>
        {buttonTitle2 && (
          <Button className={styles.button1}>{buttonTitle2}</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CardBody;
