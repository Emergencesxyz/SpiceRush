import type { NextPage } from "next";
import styles from "../referral/referral.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Table,
  Dropdown,
} from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import CardBody from "../../components/Card/Card";
import contractABI from "../../WalletHelpers/contractAbi.json";
import {
  contractAddress,
  provider,
} from "../../WalletHelpers/contractVariables";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const buyLand: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();
  const [nftQuantity, setNftQuantity] = useState<number>(1);
  const [nftPrice, setNftPrice] = useState<number>(0.25);
  const [code, setCode] = useState<any>("");
  const [userCode, setUserCode] = useState<any>("");
  const [totalReferred, setTotalReferred] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isTestnet, setIsTestNet] = useState<boolean>(false);
  const maxTransaction: number = 5;

  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contractABI as any, contractAddress);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!!account && !!library) {
        setIsActive(await contract.methods.isActive().call());
        setTotalReferred(await contract.methods.totalReferred(account).call());
        setTotalRewards(await contract.methods.bank(account).call());
        setUserCode(await contract.methods.ReferralToCode(account).call());
      }
    })();
  }, [account, library]);

  async function addNetwork(type: any) {
    if (typeof web3 !== "undefined") {
      let network: any = 0;
      network = chainId;
      let netID = network.toString();
      let params;
      if (netID == "80001") {
        params = [
          {
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com/"],
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ];
      } else {
        {
          params = [
            {
              chainId: "0x13881",
              chainName: "Polygon Mumbai",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ];
        }
      }

      if (!window.ethereum) {
        alert("No crypto wallet found");
        return;
      }
      window.ethereum
        .request({ method: "wallet_addEthereumChain", params })
        .then(() => console.log("Success"))
        .catch((error: any) => console.log("Error", error.message));
    } else {
      alert("Unable to locate a compatible web3 browser!");
    }
  }

  const hasFunds = async (nftsPrice: number) => {
    return nftsPrice <= (await library.eth.getBalance(account));
  };

  const mintNFT = async (amount: number, referralCode: string) => {
    if (!!account && !!library) {
      if (!(await contract.methods.isActive().call())) {
        alert("Sale has not started");
        return;
      }

      if (amount > maxTransaction) {
        alert("Max 5 NFT per transaction");
        return;
      }

      const nftsValue = amount * nftPrice;

      if (!(await hasFunds(nftsValue))) {
        alert("Insufficient funds");
        return;
      }

      const transactionParameters = {
        from: account,
        value: await nftsValue.toString(),
      };

      contract.methods
        .mintNFT(amount, referralCode)
        .send(transactionParameters)
        .on("error", function (error: any, receipt: any) {
          setError(error.message);
          console.log("this is the error:", error.message);
        });
    }
  };

  return (
    <>
      <header>
        <Header isMobile={isMobile} />
      </header>
      <div className={styles.container}>
        <div className={styles.connectWallet}>
          <ConnectWallet />
        </div>
        {!!account && library && (
          <>
            <Button className={styles.button1} onClick={() => addNetwork(web3)}>
              {chainId == 80001 ? (
                <span>Switch to mainnet</span>
              ) : (
                <span>Switch to testnet</span>
              )}
            </Button>
            <div>
              <Table className={styles.table}>
                <tbody>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      <strong>ApeX6</strong> Microchips
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      <img src="/pictures/microchip_side_1.png" alt="chip" />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>Referral Code*</td>
                    <td style={{ textAlign: "right" }}>
                      {userCode == 0 ? "-" : userCode}
                    </td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td style={{ color: "transparent" }}>FOUND</td>
                    <td style={{ textAlign: "right" }}>
                      <Dropdown>
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className={styles.dropdown}
                        >
                          {nftQuantity}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setNftQuantity(1)}>
                            1
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(2)}>
                            2
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(3)}>
                            3
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(4)}>
                            4
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(5)}>
                            5
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td colSpan={3} style={{ textAlign: "right" }}>
                      {nftPrice * nftQuantity} MATIC
                    </td>
                  </tr>
                  <em
                    style={{
                      color: "red",
                      fontSize: "13px",
                    }}
                  >
                    *5 MATIC Instant claimable cashback per NFT
                  </em>
                </tbody>
              </Table>
            </div>
            <div>
              <Button
                className={styles.button1}
                onClick={() => mintNFT(nftQuantity, code)}
              >
                MINT
              </Button>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <CardBody
                header={
                  <Row className="d-flex flex-row">
                    <h1> REFERRALS CASHBACK</h1>
                  </Row>
                }
                subtitle={
                  <Row className="d-flex flex-row">
                    <span style={{ color: "red", fontSize: "20px" }}>
                      Share your referral link to get a 5 MATIC reward for each
                      mint !
                    </span>
                  </Row>
                }
                textTitle1={
                  <>
                    <h2>{totalRewards} MATIC</h2>
                    <p>available cashback</p>
                  </>
                }
                textTitle2={
                  <>
                    <h2>{userCode == 0 ? "-" : userCode}</h2>
                    <p>your referral code</p>
                  </>
                }
                textSubtitle2={<p>your referral link</p>}
                buttonTitle1="CLAIM"
                buttonTitle2="SHARE"
                footer={
                  <p>
                    You referred{" "}
                    <span style={{ fontSize: "30px" }}>{totalReferred}</span>{" "}
                    mints
                  </p>
                }
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.footer}>
        <Footer isMobile={isMobile} />
      </div>
    </>
  );
};

export default buyLand;
