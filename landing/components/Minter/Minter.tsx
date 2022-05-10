import type { NextPage } from "next";
import styles from "../Minter/Minter.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Button, Table, Dropdown } from "react-bootstrap";
import CardBody from "../Card/Card";
import contractABI from "../../WalletHelpers/contractAbi.json";
import { contractAddress } from "../../WalletHelpers/contractVariables";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Minter: NextPage = () => {
  const { account, library, chainId } = useWeb3React();
  const [nftQuantity, setNftQuantity] = useState<number>(1);
  const [nftPrice, setNftPrice] = useState<number>(0.25);
  const [code, setCode] = useState<any>(0);
  const [userCode, setUserCode] = useState<any>("");
  const [totalReferred, setTotalReferred] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const maxTransaction: number = 5;

  const contract = new library.eth.Contract(
    contractABI as any,
    contractAddress
  );

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

  const hasFunds = async (nftsPrice: number) => {
    return nftsPrice <= (await library.eth.getBalance(account));
  };

  const mintNFT = async (amount: number, referralCode: number) => {
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
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {})
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

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
                      {(nftPrice * nftQuantity) / 1000000000000000000} MATIC
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
    </>
  );
};

export default Minter;
