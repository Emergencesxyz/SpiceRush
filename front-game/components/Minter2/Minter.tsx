import { FunctionComponent, useEffect, useState } from "react";
import { Col, Spinner } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import contractABI from "../../WalletHelpers/contractAbi.json";
import styles from "./Minter.module.scss";
interface Props {
  nftQuantity: number;
}

const Minter: FunctionComponent<Props> = ({ nftQuantity }): JSX.Element => {
  const { account, library } = useWeb3React();
  const [hash, setHash] = useState<string>("");
  const [transactionReceipt, setTransactionReceipt] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPublicSaleActive, setIsPublicSaleActive] = useState<boolean>(false);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  // TODO: change this for mainnet values
  const contractAddress = "0xE1A25F378dbbBA97d48b35acbef440b1339aDaE7";
  const transactionLink = `https://etherscan.io/tx/${hash}`;
  const openSeaLink = `https://opensea.io/assets/${contractAddress}/`;
  //
  const contract = new library.eth.Contract(
    contractABI as any,
    contractAddress
  );

  useEffect(() => {
    (async () => {
      setIsPublicSaleActive(await contract.methods.isPublicSaleActive().call());
    })();
  }, [account, library]);

  const MintOptions = () => {
    return (
      <Col className="text-center">
        <div className={styles.mintButton} onClick={() => mintNFT()}>
          MINT
        </div>
      </Col>
    );
  };

  const confirmationMessage = () => {
    let nftLinks: string[] = [];

    if (transactionReceipt) {
      if (transactionReceipt?.events?.Transfer.length > 1) {
        transactionReceipt?.events?.Transfer.map((values: any) => {
          const nftId = values.returnValues?.tokenId;
          nftLinks.push(openSeaLink + nftId);
        });
      } else {
        const nftId =
          transactionReceipt?.events?.Transfer?.returnValues?.tokenId;
        nftLinks = [openSeaLink + nftId];
      }
    }

    return (
      <>
        <h3>congratulations!</h3>
        <h4>
          see on opensea here:{"  "}
          {nftLinks.map((link, i) => {
            return (
              <div key={link}>
                <a target="_blank" href={link} rel="noreferrer">
                  Humanoid {i + 1}
                </a>
              </div>
            );
          })}
        </h4>
      </>
    );
  };

  const hasFunds = async (nftsPrice: number) => {
    return nftsPrice <= (await library.eth.getBalance(account));
  };

  const mintNFT = async (): Promise<void> => {
    if (!!account && !!library) {
      setError("");
      setLoading(true);

      if (!(await contract.methods.isActive().call())) {
        alert("The Sale has not started");
        setLoading(false);
        return;
      }

      // if (!isPublicSaleActive) {
      //   if (!(await contract.methods.isPresaleActive().call())) {
      //     alert("The Sale has not started");
      //     setLoading(false);
      //     return;
      //   }
      // }

      // const rawProof = await fetch(
      //   "https://alpha-api-seven.vercel.app/api/proof/" + account
      // );
      // const response = await rawProof.json();
      // const proof = response.proof;

      // if (!proof.length) {
      //   alert("Your are not in Whitelist or Raffle");
      //   setLoading(false);
      //   return;
      // }

      const proof: any = [];

      const maxPresale = 5;

      if (nftQuantity > maxPresale) {
        alert("Max 5 NFT per Transaction");
        setLoading(false);
        return;
      }

      const nftsValue =
        nftQuantity * (await contract.methods.NFTPrice().call());

      if (!(await hasFunds(nftsValue))) {
        alert("Insufficient funds");
        setLoading(false);
        return;
      }

      const transactionParameters = {
        from: account,
        value: await nftsValue.toString(),
      };

      contract.methods
        .mintNFT(nftQuantity, proof)
        .send(transactionParameters)
        .on("transactionHash", function (hash: any) {
          setHash(hash);
          /*             console.log("hash", hash);
           */
        })
        .on("receipt", function (receipt: any) {
          setTransactionReceipt(receipt);
          setLoading(false);
          /*             console.log("receipt", receipt);
           */
        })
        .on("error", function (error: any, receipt: any) {
          setError(error.message);
          console.log("this is the error:", error.message);
          setLoading(false);
        });
    }
  };

  return (
    <Col className={styles.minterContainer}>
      {account && !transactionReceipt && !isSoldOut && <MintOptions />}

      {isSoldOut && <h1>SOLD OUT!</h1>}

      <Col className="text-center">
        {hash && (
          <p>
            ✅ Check out your transaction on Etherscan{" "}
            <a href={transactionLink} target="_blank" rel="noreferrer">
              here
            </a>
          </p>
        )}

        {error && (
          <h3>
            😥 Something went wrong:
            <br />
            {error}
          </h3>
        )}

        {loading && (
          <h3>
            Waiting for transaction <Spinner animation="border" size="sm" />
          </h3>
        )}

        {transactionReceipt && confirmationMessage()}
      </Col>
    </Col>
  );
};

export default Minter;
