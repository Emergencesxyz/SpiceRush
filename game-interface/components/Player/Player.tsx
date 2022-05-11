import { useContext, useState } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";
import styles from "./Player.module.scss";
import { Button, Modal } from "react-bootstrap";

const Player = (): JSX.Element => {
    const { account, library } = useWeb3React();
    const gameContext = useContext(GameContext);
    const { setPlayerDirection, characterInfo, setCharacterInfo } = gameContext;
    const blockchainService = new BlockchainService(account);
    const [controlsImg, setControlsImg] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [fightAgain, setFightAgain] = useState<any>({});

    const toggle = () => setShowModal(!showModal);

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

    const setDirectionAndImg = (position: number) => {
        setPlayerDirection(position);
        setControlsImg(position);
    }

    const handleActions = async (action: string) => {
        if (action == "mine") {
            console.log("mine")
            return await blockchainService.mine(characterInfo.id as number, 1, library);
        }

        if (action == "rest") {
            return await blockchainService.rest(characterInfo.id as number, 1, library);
        }

        if (action == "spawn") {
            return await blockchainService.spawn(characterInfo.id as number, library);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.firstWrapper}>
                {/* Player Information */}
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

            {/* Player Stats  */}
            <div className={styles.statsContainer}>
                <div className={styles.statsSection}>
                    <img src="/assets/pic.png" alt="pic logo" />
                    <p>12300</p>
                </div>
                <div className={styles.statsSection}>
                    <img src="/assets/hearth.png" alt="hearth logo" />
                    <div className={styles.barWrapper}>
                        <p>1000 / 9000</p>
                        <div className={styles.redBar}></div>
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <img src="/assets/energy.png" alt="energy logo" />
                    <div className={styles.barWrapper}>
                        <p>5800 / 9000</p>
                        <div className={styles.blueBar}></div>
                    </div>
                </div>
            </div>

            {/* Player controls */}
            <div className={styles.controls}>
                <img className={styles.bg} src="/assets/control_bg.png" alt="controls background" />

                <div className={styles.btnMine} onClick={() => handleActions("mine")}>
                </div>

                <div className={styles.btnFight}>
                </div>

                <div className={styles.btnSit} onClick={() => toggle()}>
                </div>

                <div className={styles.actions}>
                    <img src={`/assets/actions_${controlsImg}.png`} alt="actions 0" />
                    <div className={styles.vertical}>
                        <div
                            onMouseEnter={() => setDirectionAndImg(4)}
                            onMouseLeave={() => setDirectionAndImg(0)}
                            onClick={() => moveCharacter("up")}
                            className={styles.button}
                        ></div>
                    </div>

                    <div className={styles.center}>
                        <div
                            onMouseEnter={() => setDirectionAndImg(3)}
                            onMouseLeave={() => setDirectionAndImg(0)}
                            onClick={() => moveCharacter("left")}
                            className={styles.button}
                        ></div>
                        <div
                            onMouseEnter={() => setDirectionAndImg(1)}
                            onMouseLeave={() => setDirectionAndImg(0)}
                            onClick={() => moveCharacter("right")}
                            className={styles.button}
                        ></div>
                    </div>

                    <div className={styles.vertical}>
                        <div
                            onMouseEnter={() => setDirectionAndImg(2)}
                            onMouseLeave={() => setDirectionAndImg(0)}
                            onClick={() => moveCharacter("down")}
                            className={styles.button}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={toggle}
                centered
                aria-labelledby="join discrod"
                animation={false}
            >
                <div className={styles.modalContainer}>
                    <img className={styles.imgHeader} src="/assets/modal_sit.png" alt="header icon" />

                    <div className={styles.contentWrapper}>
                        <img className={styles.imgContainer} src="/assets/modal_container.png" alt="modal container" />

                        <div className={styles.optionsWrapper}>
                            <h1>sit</h1>
                        </div>
                    </div>

                    <div className={styles.sitContainer}>
                        <img className={styles.bg} src="/assets/btn_actions.png" alt="claim button" />
                        <div className={styles.text}>
                            <h1>SIT</h1>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Player;
