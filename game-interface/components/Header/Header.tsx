import { useWeb3React } from "@web3-react/core";
import { injected } from "../../WalletHelpers/connectors";

import styles from "./SelectPlayer.module.scss";
import Router from "next/router";

const Header = (): JSX.Element => {
    const context = useWeb3React();
    const { account, deactivate, connector } = context;

    const killSession = () => {
        if (connector === injected) {
            deactivate();
        } else {
            (connector as any).close();
        }
        Router.push("/");
    }

    return (
        <div style={{ display: "flex", alignItems: "center", marginTop: "50px", marginBottom: "150px" }}>
            <h4>{account}</h4>
            <button onClick={() => Router.push("/")}>
                change character
            </button>
            <button onClick={() => killSession()}>
                disconnect
            </button>
        </div>
    );
};

export default Header;
