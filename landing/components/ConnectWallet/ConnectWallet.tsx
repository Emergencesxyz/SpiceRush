import { useState, useEffect } from "react";
import { Col, Button, Dropdown, Spinner, Modal } from "react-bootstrap";
import styles from "./ConnectWallet.module.scss";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../../connectors/metaMask";
import { walletConnect } from "../../connectors/walletConnect";
import { coinbaseWallet } from "../../connectors/coinbaseWallet";
import MetaMaskCard from "../Web3/connectors/MetaMaskCard";
import CoinbaseWalletCard from "../Web3/connectors/CoinbaseWalletCard";
import WalletConnectCard from "../Web3/connectors/WalletConnectCard";

const ConnectWallet = () => {
  const context = useWeb3React<any>();
  const { connector, account, chainId, provider } = context;
  const [showModal, setShowModal] = useState<boolean>(false);

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly();
    void walletConnect.connectEagerly();
    void coinbaseWallet.connectEagerly();
  }, []);

  // lock the website to the mainnet network
  /*   useEffect(() => {
    if (account) {
      if (chainId != 1) {
        connector.deactivate();
        alert("This website is only compatible with the ethereum mainnet");
      }
    }
  }, [chainId, account]); */

  const toggle = () => setShowModal(!showModal);

  const handleConnection = () => {
    if (!!!account) toggle();
  };

  const modalContent = () => {
    return (
      <Col className={styles.modalContent}>
        <div className={styles.metamask}>
          <MetaMaskCard />
        </div>
        <div className={styles.walletConnect}>
          <CoinbaseWalletCard />
        </div>
        <div className={styles.walletLink}>
          <WalletConnectCard />
        </div>
      </Col>
    );
  };

  return (
    <>
      <Col>
        {account ? (
          <Dropdown>
            <Dropdown.Toggle variant="dark" className="rounded-pill px-5 my-2">
              {`${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => void connector.deactivate()}>
                Disconnect
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            variant="dark"
            className={styles.connectButton}
            onClick={() => handleConnection()}
          >
            CONNECT WALLET
          </Button>
        )}
      </Col>

      <Modal
        show={showModal}
        onHide={toggle}
        centered
        aria-labelledby="Wallet connection"
        animation={false}
      >
        <Modal.Body style={{ color: "black" }} onClick={() => toggle()}>
          {modalContent()}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConnectWallet;
