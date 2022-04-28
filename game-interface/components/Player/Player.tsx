import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../WalletHelpers/connectors";

import styles from "./SelectPlayer.module.scss";
import Router from "next/router";

const Player = (): JSX.Element => {
    const gameContext = useContext(GameContext);
    const { setPlayerDirection, characterInfo } = gameContext;

    return (
        <div>
            <div>
                <p>id: {characterInfo.id}</p>
                <p>lvl: {characterInfo.lvl}</p>
                <p>xp: {characterInfo.xp}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                    User Panel controls
                    <button
                        onMouseEnter={() => setPlayerDirection(1)}
                        onMouseLeave={() => setPlayerDirection(0)}
                    >
                        rigth
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(2)}
                        onMouseLeave={() => setPlayerDirection(0)}
                    >
                        down
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(3)}
                        onMouseLeave={() => setPlayerDirection(0)}
                    >
                        left
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(4)}
                        onMouseLeave={() => setPlayerDirection(0)}
                    >
                        up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Player;
