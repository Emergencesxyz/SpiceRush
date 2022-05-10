import { useState, FunctionComponent, ReactNode } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "../Card/Card.module.scss";

interface Props {
  header: ReactNode;
  subtitle: ReactNode;
  textTitle1: ReactNode;
  textTitle2: ReactNode;
  textSubtitle1?: ReactNode;
  textSubtitle2?: ReactNode;
  buttonTitle1?: string;
  buttonTitle2?: string;
  footer: ReactNode;
}

const CardBody: FunctionComponent<Props> = (props) => {
  const {
    header,
    subtitle,
    textTitle1,
    textSubtitle1,
    textTitle2,
    textSubtitle2,
    buttonTitle1,
    buttonTitle2,
    footer,
  } = props;
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title className={styles.header}>{header}</Card.Title>
        <Card.Subtitle className={styles.text}>{subtitle}</Card.Subtitle>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Card.Text className={styles.text}>{textTitle1}</Card.Text>
          <div className={styles.buttonContainer}>
            <Button className={styles.button1}>{buttonTitle1}</Button>
            <div className={styles.rectangle1}></div>
          </div>
          {textSubtitle1}
          <Card.Text className={styles.text}>{textTitle2}</Card.Text>
          {buttonTitle2 && (
            <div className={styles.buttonContainer}>
              <Button className={styles.button1}>{buttonTitle2}</Button>
              <div className={styles.rectangle1}></div>
            </div>
          )}
          {textSubtitle2}
        </div>
        {footer}
      </Card.Body>
    </Card>
  );
};

export default CardBody;
