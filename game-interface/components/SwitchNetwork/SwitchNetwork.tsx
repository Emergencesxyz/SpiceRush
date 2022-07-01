import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { Col } from "react-bootstrap";
import styles from "./SwitchNetwork.module.scss";

const SwitchNetwork = () => {
    const context = useWeb3React<Web3>();
    const { account, chainId, library } = context;

    const switchPolygon = async () => {
        if (typeof library !== "undefined") {
            let netID = chainId.toString();
            let params: any;
            // if (netID !== "137") {
            //     params = [
            //         {
            //             chainId: "0x89",
            //             chainName: "Polygon Mainnet",
            //             nativeCurrency: {
            //                 name: "MATIC",
            //                 symbol: "MATIC",
            //                 decimals: 18,
            //             },
            //             rpcUrls: ["https://polygon-rpc.com/"],
            //             blockExplorerUrls: ["https://polygonscan.com/"],
            //         },

            //     ];
            // }
            if (netID !== "80001") {
                params = [
                    {
                        chainId: "0x13881",
                        chainName: "Mumbai",
                        nativeCurrency: {
                            name: "MATIC",
                            symbol: "MATIC",
                            decimals: 18,
                        },
                        rpcUrls: ["https://rpc-mumbai.matic.today"],
                        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                    },
                ];
            }

            (window as any).ethereum
                .request({ method: "wallet_addEthereumChain", params })
                .then(() => console.log("Success"))
                .catch((error: any) => console.log("Error", error.message));
        } else {
            alert("Unable to locate a compatible web3 browser!");
        }
    }

    return (
        <Col
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingBlock: "30px"
            }}
        >
            <h4>This website is only compatible with the polygon testner network</h4>
            <h4>Please switch using the button below:</h4>
            <div className={styles.button} onClick={() => switchPolygon()} >
                <img src="/assets/button_on.png" alt="change character" />
                <p>Switch Network</p>
            </div>
        </Col>
    );
};

export default SwitchNetwork;
