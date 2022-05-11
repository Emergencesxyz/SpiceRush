import { FunctionComponent, ReactNode } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "../Card/Card.module.scss";
import { useWeb3React } from "@web3-react/core";
import contractABI from "../../WalletHelpers/contractAbi.json";
import { contractAddressTestnet } from "../../WalletHelpers/contractVariables";

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
  userCode: string;
}

const CardBody: FunctionComponent<Props> = (props) => {
  const { account, library } = useWeb3React();
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
    userCode,
  } = props;

  const contract = new library.eth.Contract(
    contractABI as any,
    contractAddressTestnet
  );

  const claim = async () => {
    if (!!account && !!library) {
      if ((await contract.methods.bank(account).call()) == 0) {
        alert("No funds are available for claim");
        return;
      }

      contract.methods
        .claim()
        .send({ from: account })
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {})
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

  console.log();

  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title className={styles.header}>{header}</Card.Title>
        <Card.Subtitle className={styles.text}>{subtitle}</Card.Subtitle>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Card.Text className={styles.text}>{textTitle1}</Card.Text>
          <div className={styles.buttonContainer} onClick={() => claim()}>
            <Button className={styles.button1}>{buttonTitle1}</Button>
            <div className={styles.rectangle1}></div>
          </div>
          {textSubtitle1}
          <Card.Text className={styles.text}>{textTitle2}</Card.Text>
          {buttonTitle2 && (
            <a
              href={`https://twitter.com/intent/tweet?url=https://www.spicerush.io/?number=${userCode}&text=Join_Us`}
              target="_blank"
            >
              <div className={styles.buttonContainer}>
                <Button className={styles.button1}>{buttonTitle2}</Button>

                <div className={styles.rectangle1}></div>
              </div>
            </a>
          )}
          <div>
            <span>{textSubtitle2}</span>
            <span>
              {userCode && `https://www.spicerush.io/?number=${userCode}`}
            </span>
          </div>
        </div>
        {footer}
      </Card.Body>
    </Card>
  );
};

export default CardBody;
