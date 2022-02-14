import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import styles from "./Raffle.module.scss";
import { useWeb3React } from "@web3-react/core";

const Raffle = () => {
  const { account, library } = useWeb3React();
  const [confirmation, setConfirmation] = useState<boolean>(false);

  const handleSignature = async () => {
    if (!!account && !!library) {
      const hash = library.utils.sha3(account);
      const signature = await library.eth.personal.sign(hash, account);
      setConfirmation(true);

      try {
        const resp = await fetch(
          "https://alpha-api-seven.vercel.app/api/raffle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ account, signature }),
          }
        );

        if (resp.ok) {
          setConfirmation(resp.ok);
        } else {
          const error = await resp.json();
          throw new Error(error.message);
        }
      } catch (error) {
        console.log(error);
        // alert(error?.message || "Something went wrong");
      }
    }
  };

  return (
    <Col className="text-center">
      {/* {!confirmation ? (
        <div className={styles.raffleButton} onClick={() => handleSignature()}>
          JOIN THE RAFFLE
        </div>
      ) : (
      )} */}
      <div className={styles.success}>
        <h1>
          Raffle registration is over.
        </h1>
      </div>
    </Col>
  );
};

export default Raffle;
