import styles from "./LogScreen.module.scss";
import { GameContext } from "../../context/GameContext";
import { useContext, useState } from "react";

const LogScreen = (): JSX.Element => {
    const gameContext = useContext(GameContext);
    // const { logs } = gameContext;
    const logs = [
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
        { type: "event", sender: "Spice Rush", message: "Crebriores maerens crebriores advenit torrentes damnis ex Gallus imbres quorum." },
    ]

    const renderLogs = () => {
        return logs.map((m) => {
            return (
                <div className={styles.logCard}>
                    <img src="/assets/log_icon.svg" alt="log icon" />
                    <p>Event: {m.message}</p>
                </div>
            )
        })
    }

    return (
        <div className={styles.container}>
            <img src="/assets/log_container.png" alt="map container" />
            <div className={styles.logsWrapper}>
                <div className={styles.logs}>
                    {renderLogs()}
                </div>
            </div>
        </div>
    );
};

export default LogScreen;
