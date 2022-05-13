import styles from "../Minter/Minter.module.scss";
import { useEffect, useState, FunctionComponent } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Button,
  Table,
  Dropdown,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import CardBody from "../Card/Card";
import contractABI from "../../WalletHelpers/contractAbi.json";
import {
  contractAddress,
  provider,
} from "../../WalletHelpers/contractVariables";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Props {
  referralCode: any;
  isMobile: boolean;
}

const Minter: FunctionComponent<Props> = (props): JSX.Element => {
  const { referralCode, isMobile } = props;
  const { account, library, chainId } = useWeb3React();
  const [nftQuantity, setNftQuantity] = useState<number>(1);
  const [nftPrice, setNftPrice] = useState<number>(0.25);
  const [userCode, setUserCode] = useState<any>("");
  const [writtenCode, setWrittenCode] = useState<any>("");
  const [totalReferred, setTotalReferred] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const maxTransaction: number = 5;
  const alch = createAlchemyWeb3(provider);

  const contract = new library.eth.Contract(
    contractABI as any,
    contractAddress
  );

  useEffect(() => {
    if (!!referralCode) setWrittenCode(referralCode);
  });

  useEffect(() => {
    (async () => {
      if (!!account && !!library) {
        setIsActive(await contract.methods.isActive().call());
        setTotalReferred(await contract.methods.totalReferred(account).call());
        setTotalRewards(await contract.methods.bank(account).call());
        setUserCode(await contract.methods.ReferralToCode(account).call());
        setNftPrice(await contract.methods.NFTPrice().call());
      }
    })();
  }, [account, library]);

  async function switchPolygon(type: any) {
    if (typeof library !== "undefined") {
      let network: any = 0;
      network = chainId;
      let netID = network.toString();
      let params;
      if (netID !== "137") {
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
      }

      /*  if (!window.ethereum) {
        alert("No crypto wallet found");
        return;
      } */
      window.ethereum
        .request({ method: "wallet_addEthereumChain", params })
        .then(() => console.log("Success"))
        .catch((error: any) => console.log("Error", error.message));
    } else {
      alert("Unable to locate a compatible web3 browser!");
    }
  }

  const getPriorityGasPrice = async () => {
    let res = await alch.eth.getMaxPriorityFeePerGas();
    return res;
  };

  const hasFunds = async (nftsPrice: number) => {
    return nftsPrice <= (await library.eth.getBalance(account));
  };

  const mintNFTwithReferral = async (amount: number, referralCode: string) => {
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

      const codeToReferral = await contract.methods
        .codeToReferral(referralCode)
        .call();

      if (codeToReferral == 0) {
        alert("referral code is not valid !");
        return;
      }

      const priority = Number(await getPriorityGasPrice()) / 1000000000;

      const transactionParameters = {
        from: account,
        value: await nftsValue.toString(),
        maxPriorityFeePerGas: library.utils.toWei(priority.toString(), "gwei"),
      };

      contract.methods
        .mintNFT(amount, referralCode)
        .send(transactionParameters)
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {})
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

  const mintNFTwithoutReferral = async (amount: number) => {
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

      const priority = Number(await getPriorityGasPrice()) / 1000000000;

      const transactionParameters = {
        from: account,
        value: await nftsValue.toString(),
        maxPriorityFeePerGas: library.utils.toWei(priority.toString(), "gwei"),
      };

      contract.methods
        .mintNFT(amount)
        .send(transactionParameters)
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {})
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

  if (chainId !== 137) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center" }}>
          This website is only compatible with the polygon mainnet network.{" "}
        </p>
        {!isMobile && (
          <>
            <p>Please switch using the button below:</p>

            <div className={styles.buttonContainer}>
              <Button
                className={styles.button1}
                onClick={() => switchPolygon(library)}
              >
                Switch network
              </Button>

              <div className={styles.rectangle1}></div>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <>
        <div className={styles.container}>
          {!!account && library && (
            <>
              <div>
                <Table className={styles.table}>
                  <tbody>
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        <strong>APEx7</strong> Microchips
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        {/*  <img src="/pictures/microchip_side_1.png" alt="chip" /> */}
                        <img src="/pictures/microchip.gif" alt="chip" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>Referral Code*</td>
                      <td className={styles.inputTD}>
                        {!referralCode && (
                          <InputGroup className={styles.inputGroup}>
                            <FormControl
                              type="number"
                              placeholder="referral code"
                              aria-label="referral code"
                              aria-describedby="basic-addon1"
                              className={styles.referral}
                              value={referralCode}
                              onChange={(e) => setWrittenCode(e.target.value)}
                            />
                          </InputGroup>
                        )}
                        {referralCode && referralCode}
                      </td>
                    </tr>
                    {/* <tr>
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
                  </tr> */}
                    <tr>
                      <td>Price</td>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "right",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        {(nftPrice * nftQuantity) / 1000000000000000000} MATIC
                      </td>
                    </tr>
                    <em
                      style={{
                        color: "red",
                        fontSize: "13px",
                      }}
                    >
                      *a MATIC cashback will be claimable per each NFT
                    </em>
                  </tbody>
                </Table>
              </div>

              <div className={styles.buttonContainer}>
                {referralCode && (
                  <Button
                    className={styles.button1}
                    onClick={() =>
                      mintNFTwithReferral(nftQuantity, referralCode)
                    }
                  >
                    MINT
                  </Button>
                )}
                {!referralCode && writtenCode && (
                  <Button
                    className={styles.button1}
                    onClick={() =>
                      mintNFTwithReferral(nftQuantity, writtenCode)
                    }
                  >
                    MINT
                  </Button>
                )}
                {!referralCode && !writtenCode && (
                  <Button
                    className={styles.button1}
                    onClick={() => mintNFTwithoutReferral(nftQuantity)}
                  >
                    MINT
                  </Button>
                )}
                <div className={styles.rectangle1}></div>
              </div>

              {userCode !== undefined && userCode !== "0" && (
                <div
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardBody
                    header={
                      <Row className="d-flex flex-row">
                        <h1> REFERRALS CASHBACK</h1>
                      </Row>
                    }
                    subtitle={
                      <Row className="d-flex flex-row">
                        <span style={{ color: "red", fontSize: "20px" }}>
                          Share your referral link to get a 5 MATIC reward for
                          each mint !
                        </span>
                      </Row>
                    }
                    textTitle1={
                      <>
                        <h2>{totalRewards / 1000000000000000000} MATIC</h2>
                        <p>available cashback</p>
                      </>
                    }
                    textTitle2={
                      <>
                        <h2>{userCode == 0 ? "-" : userCode}</h2>
                        <p>your referral code</p>
                      </>
                    }
                    textSubtitle2={<p>your referral link:</p>}
                    buttonTitle1="CLAIM"
                    buttonTitle2="SHARE"
                    footer={
                      <p>
                        You referred{" "}
                        <span style={{ fontSize: "30px" }}>
                          {totalReferred}
                        </span>{" "}
                        mints
                      </p>
                    }
                    userCode={userCode}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }
};

export default Minter;
