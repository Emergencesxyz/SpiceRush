import { useState, useEffect } from "react";
import { Button, Spinner, Col, Dropdown, Modal } from "react-bootstrap";
import styles from "../ConnectWallet/ConnectWallet.module.scss";
import Web3 from "web3";
import contractAbi from "../../WalletHelpers/contractAbi.json";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import {
  injected,
  walletconnect,
  walletlink,
} from "../../WalletHelpers/connectors";
import {
  useEagerConnect,
  useInactiveListener,
} from "../../WalletHelpers/hooks";

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "Install MetaMask on desktop or visit from Metamask app browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network. Connect to Rinkeby TestNet";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

const ConnectWallet = () => {
  const { connector, account, activate, deactivate, active, library, error } =
    useWeb3React<Web3>();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  const toggle = () => setShowModal(!showModal);

  const modalErrorContent = (error: Error) => {
    return (
      <Col className={styles.modalContent}>
        <p>{getErrorMessage(error)}</p>
        <Button
          className="rounded-pill px-5 my-2"
          onClick={() => {
            deactivate();
          }}
        >
          Go back
        </Button>
      </Col>
    );
  };

  const modalContent = () => {
    return (
      <Col className={styles.modalContent}>
        <h2>Connect your wallet.</h2>
        {/* <p>
          By connecting your wallet, you agree to our <br /> Terms of Service and our Privacy
          Policy.
        </p> */}

        {/* Metamask */}
        <Button
          className={styles.metamask}
          onClick={() => {
            setActivatingConnector(injected);
            activate(injected);
          }}
        >
          <div className={styles.buttonContent}>
            {activatingConnector === injected ? (
              <>
                Connecting...
                <Spinner size="sm" animation="border" />
              </>
            ) : (
              <>
                Metamask
                <img
                  src="pictures/metamask.svg"
                  width={30}
                  height={30}
                  alt="logo metamask"
                />
              </>
            )}
          </div>
        </Button>

        {/* WalletConnect */}
        <Button
          className={styles.walletConnect}
          onClick={() => {
            setActivatingConnector(walletconnect);
            activate(walletconnect);
          }}
        >
          <div className={styles.buttonContent}>
            {activatingConnector === walletconnect ? (
              <>
                Connecting...
                <Spinner size="sm" animation="border" />
              </>
            ) : (
              <>
                WalletConnect
                <img
                  src="pictures/walletConnect.svg"
                  width={30}
                  height={30}
                  alt="logo walletconnect"
                />
              </>
            )}
          </div>
        </Button>

        {/* WalletLink */}
        <Button
          className={styles.walletLink}
          onClick={() => {
            setActivatingConnector(walletlink);
            activate(walletlink);
          }}
        >
          <div className={styles.buttonContent}>
            {activatingConnector === walletlink ? (
              <>
                Connecting...
                <Spinner size="sm" animation="border" />
              </>
            ) : (
              <>
                WalletLink
                <img
                  src="pictures/walletlink.png"
                  width={30}
                  height={30}
                  alt="logo walletlink"
                />
              </>
            )}
          </div>
        </Button>
      </Col>
    );
  };

  return (
    <>
      <Col className="d-flex justify-content-center">
        {account ? (
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              style={{ border: "1px white solid" }}
              className="px-5 my-2"
            >
              {`${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => deactivate()}>
                Disconnect
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            variant="light"
            className="rounded-pill px-5 my-2"
            onClick={() => setShowModal(true)}
          >
            Connect Wallet
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
        <Modal.Body style={{ color: "black" }}>
          {!!error ? modalErrorContent(error) : modalContent()}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConnectWallet;
