import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";
import styles from "./Player.module.scss";
import { Modal } from "react-bootstrap";

const Player = (): JSX.Element => {
    const { account, library } = useWeb3React();
    const gameContext = useContext(GameContext);
    const { setPlayerDirection, characterInfo, setCharacterInfo, sendLog } = gameContext;
    const blockchainService = new BlockchainService(account);
    const [controlsImg, setControlsImg] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [fightAgain, setFightAgain] = useState<any>({});
    const [canLvlUp, setCanLvlUp] = useState<boolean>(false);

    const toggle = () => setShowModal(!showModal);

    useEffect(() => {
        (async () => {
            setCanLvlUp(await blockchainService.canLevelUp(characterInfo.id));
        })();
    }, [characterInfo]);

    const moveCharacter = async (e: any) => {
        sendLog("waitting for transanction <img src='/assets/loader.gif' alt='loader'/>")
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

        try {
            let res = await blockchainService.moveCharacter(
                +characterInfo.id as number,
                x,
                y,
                library
            );

            if (res) {
                sendLog(`player moved to ${x},${y}`)
                // setCharacterInfo({ ...characterInfo, x, y })
                setCharacterInfo(await blockchainService.getCharacterInfo(characterInfo.id));
            }
        } catch (e) {
            sendLog("transaction canceled")
        }
    };

    const setDirectionAndImg = (position: number) => {
        setPlayerDirection(position);
        setControlsImg(position);
    }

    const handleActions = async (action: string, lvlUpId?: number) => {
        sendLog("waitting for transanction <img src='/assets/loader.gif' alt='loader'/>")
        try {
            if (action == "mine") {
                await blockchainService.mine(characterInfo.id as number, 1, library);
            } else if (action == "rest") {
                await blockchainService.rest(characterInfo.id as number, 1, library);
            } else if (action == "spawn") {
                await blockchainService.spawn(characterInfo.id as number, library);
            } else if (action == "lvlUp") {
                await blockchainService.levelUp(characterInfo.id,
                    lvlUpId,
                    library
                );
            }
        } catch (e) {
            return sendLog(`${action} canceled`)
        }

        setCharacterInfo(await blockchainService.getCharacterInfo(characterInfo.id));
        return sendLog(`${action} success`);
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
                    {canLvlUp && (
                        <div onClick={() => handleActions("lvlUp", 3)} style={{ cursor: "pointer" }}>
                            <img src="/assets/arrow_up.gif" alt="level up icon" />
                        </div>
                    )}
                    <p>{characterInfo.spiceMined}</p>
                </div>
                <div className={styles.statsSection}>
                    <img src="/assets/hearth.png" alt="hearth logo" />
                    {canLvlUp && (
                        <div onClick={() => handleActions("lvlUp", 1)} style={{ cursor: "pointer" }}>
                            <img src="/assets/arrow_up.gif" alt="level up icon" />
                        </div>
                    )}
                    <div className={styles.barWrapper}>
                        <p>{characterInfo.stats?.hp} / {characterInfo.stats?.hpMax}</p>
                        <div className={styles.hpBar}>
                            <div
                                className={styles.hp}
                                style={{ width: (characterInfo.stats?.hp / characterInfo.stats?.hpMax * 100) + "%" }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <img src="/assets/energy.png" alt="energy logo" />
                    {canLvlUp && (
                        <div onClick={() => handleActions("lvlUp", 2)} style={{ cursor: "pointer" }}>
                            <img src="/assets/arrow_up.gif" alt="level up icon" />
                        </div>
                    )}
                    <div className={styles.barWrapper}>
                        <p>{characterInfo.stats?.energy} / {characterInfo.stats?.energyMax}</p>
                        <div className={styles.energyBar}>
                            <div
                                className={styles.energy}
                                style={{ width: (characterInfo.stats?.energy / characterInfo.stats?.energyMax * 100) + "%" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Player controls */}
            {characterInfo?.stats?.hp ? (
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
            ) : (
                <button onClick={() => handleActions("spawn")}>spawn</button>
            )}

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={toggle}
                centered
                aria-labelledby="sit modal"
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
                        <div className={styles.text} onClick={() => handleActions("rest")}>
                            <h1>SIT</h1>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Player;
