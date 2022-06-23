import styles from "./MintPlayer.module.scss";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";
import { Spinner } from "react-bootstrap";

const MintPlayer = (): JSX.Element => {
    const { account, library } = useWeb3React();
    const gameContext = useContext(GameContext);
    const { setLastUpdate } = gameContext;
    const blockchainService = new BlockchainService(account);
    const [loading, setLoading] = useState<boolean>(false);

    const mintPlayer = async () => {
        setLoading(true);
        await blockchainService.mintNft(1, library);
        console.log("price", await blockchainService.nftPrice());
        setLoading(false);
        setLastUpdate(Date.now());
    }

    return (
        <div className={styles.container}>
            <div className={styles.button} onClick={() => mintPlayer()} >
                <img src="/assets/button_on.png" alt="mint character" />
                <p>Mint a new character</p>
            </div>
            {loading && (
                <div className={styles.loader}>
                    Waiting for transaction {"  "}
                    <Spinner animation="border" size="sm" style={{ color: "white" }} />
                </div>
            )}
        </div>
    );
};

export default MintPlayer;
