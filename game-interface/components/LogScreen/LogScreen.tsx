import styles from "./LogScreen.module.scss";
import { GameContext } from "../../context/GameContext";
import ScrollToBottom from "react-scroll-to-bottom";
import { useContext } from "react";
import parse from "html-react-parser";

const LogScreen = (): JSX.Element => {
    const gameContext = useContext(GameContext);
    const { logs } = gameContext;

    const renderLogs = () => {
        return logs.map((m, index) => {
            return (
                <div key={index} className={styles.logCard}>
                    <img src="/assets/log_icon.svg" alt="log icon" />
                    <p>Event: {parse(m.message)}</p>
                </div>
            )
        })
    }

    return (
        <div className={styles.container}>
            <img src="/assets/log_container.png" alt="map container" />
            <div className={styles.logsWrapper}>
                <ScrollToBottom className={styles.logs}>
                    {renderLogs()}
                </ScrollToBottom>
            </div>
        </div>
    );
};

export default LogScreen;
