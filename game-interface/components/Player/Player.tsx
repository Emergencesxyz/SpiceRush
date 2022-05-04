import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";
import styles from "./Player.module.scss";

const Player = (): JSX.Element => {
    const { account, library } = useWeb3React();
    const gameContext = useContext(GameContext);
    const { setPlayerDirection, characterInfo, setCharacterInfo } = gameContext;
    const blockchainService = new BlockchainService(account);

    const moveCharacter = async (e: any) => {
        let x, y: number;
        // const audioScifi = new Audio("./sounds/button_scifi.mp3");
        // audioScifi.play();

        if (e === "right") {
            x = characterInfo.x + 1;
            y = characterInfo.y;
        } else if (e === "left") {
            x = characterInfo.x - 1;
            y = characterInfo.y;
        } else if (e === "up") {
            x = characterInfo.x;
            y = characterInfo.y + 1;
        } else if (e === "down") {
            x = characterInfo.x;
            y = characterInfo.y - 1;
        } else return;

        let res = await blockchainService.moveCharacter(
            +characterInfo.id as number,
            x,
            y,
            library
        );

        if (res) {
            // TODO: update character in game context
            setCharacterInfo({ ...characterInfo, x, y })
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.firstWrapper}>
                <div className={styles.playerInfo}>
                    <img src="/assets/nft_player.png" alt="nft image" />
                    <div className={styles.playerStats}>
                        <div className={styles.leftWrapper}>
                            <div className={styles.left}>
                                <img src="/assets/name_logo.png" alt="name logo" />
                                <div className={styles.name}>
                                    <p>
                                        #NO NAME
                                    </p>
                                </div>
                                <div className={styles.lock} onClick={() => console.log('lock click')}>
                                    <img src="/assets/lock.png" alt="lock logo" />
                                </div>
                            </div>
                        </div>

                        <div className={styles.right}>
                            <p className={styles.title}>Lvl</p>
                            <p className={styles.level}>{characterInfo.lvl}</p>
                            <div className={styles.xp}>
                                <img src="/assets/xp.png" alt="xp icon" />
                                <p>{characterInfo.xp} / 10000</p>
                            </div>
                            <div className={styles.xp}>
                                <img src="/assets/pos.png" alt="xp icon" />
                                <p>[{characterInfo.x}, {characterInfo.y} ]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.statsContainer}>
                <div className={styles.statsSection}>
                    <img src="/assets/pic.png" alt="pic logo" />
                    <p>sdfsdf</p>
                </div>
                <div className={styles.statsSection}>
                    <img src="/assets/hearth.png" alt="hearth logo" />
                    <div style={{ border: "1px solid red", width: "100%", height: "30px" }}></div>
                </div>
                <div className={styles.statsSection}>
                    <img src="/assets/energy.png" alt="energy logo" />
                    <div style={{ border: "1px solid red", width: "100%", height: "30px" }}></div>
                </div>
            </div>

            <div className={styles.controls}>
                <div>

                </div>


            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                    User Panel controls
                    <button
                        onMouseEnter={() => setPlayerDirection(1)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("right")}
                    >
                        rigth
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(2)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("down")}
                    >
                        down
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(3)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("left")}
                    >
                        left
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(4)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("up")}
                    >
                        up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Player;
