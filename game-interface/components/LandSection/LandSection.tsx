import { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GameContext } from "../../context/GameContext";
import styles from "./LandSection.module.scss";

const LandSection = (): JSX.Element => {
    const gameContext = useContext(GameContext);
    const { selectedTile } = gameContext;

    return (
        <div className={styles.container}>
            <div className={styles.info} style={{ backgroundImage: "url(assets/city.png)" }}>
                <div className={styles.stats}>
                    <div className={styles.infoWrapper}>
                        <div className={styles.content}>
                            <div className={styles.left}>
                                <p className={styles.title}>Lvl</p>
                                <p className={styles.level}>{selectedTile.level}</p>
                            </div>

                            <div className={styles.right}>
                                <div className={styles.infoSection}>
                                    <div className={styles.imgWrapper} >
                                        <img src="/assets/ape_icon.png" alt="ape icon" />
                                    </div>
                                    <p>{selectedTile.foesAmount}</p>
                                </div>

                                <div className={styles.infoSection}>
                                    <div className={styles.imgWrapper} >
                                        <img src="/assets/spice_icon.png" alt="spice icon" />
                                    </div>
                                    <p>{selectedTile.spiceAmount}</p>
                                </div>

                                <div className={styles.infoSection}>
                                    <div className={styles.imgWrapper} >
                                        <img src="/assets/pos.png" alt="position icon" />
                                    </div>
                                    <p>[{selectedTile.x}, {selectedTile.y}]</p>
                                </div>
                            </div>
                        </div>

                        <OverlayTrigger placement='bottom' overlay={<Tooltip>SOON</Tooltip>}>
                            <div className={styles.claimContainer}>
                                <img className={styles.bg} src="/assets/btn_actions.png" alt="claim button" />
                                <div className={styles.text}>
                                    <h1>CLAIM</h1>
                                </div>
                                <div className={styles.price}>
                                    <img src="/assets/spice_icon.png" alt="spice icon" />
                                    <p>230</p>
                                </div>
                            </div>
                        </OverlayTrigger>
                    </div>

                    <div>
                        <div className={styles.tileName}>
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
                </div>
            </div>
        </div>
    );
};

export default LandSection;
