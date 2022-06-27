import styles from "./ListPlayers.module.scss";
import { GameContext } from "../../context/GameContext";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const testListOfPlayers = [
    {
        lvl: 0,
        nextActionTime: 1651566379,
        stats: {
            energy: 0,
            energyMax: 10,
            hp: 0,
            hpMax: 10,
            mining: 10,
            miningMax: null
        },
        x: -2,
        y: -1,
        xp: 209,
        id: 30,
        spiceMined: 167
    },
    {
        lvl: 1,
        nextActionTime: 1651566379,
        stats: {
            energy: 0,
            energyMax: 10,
            hp: 0,
            hpMax: 10,
            mining: 10,
            miningMax: null
        },
        x: -2,
        y: -1,
        xp: 209,
        id: 31,
        spiceMined: 167
    },
    {
        lvl: 2,
        nextActionTime: 1651566379,
        stats: {
            energy: 0,
            energyMax: 10,
            hp: 0,
            hpMax: 10,
            mining: 10,
            miningMax: null
        },
        x: -2,
        y: -1,
        xp: 209,
        id: 32,
        spiceMined: 167
    },
    {
        lvl: 3,
        nextActionTime: 1651566379,
        stats: {
            energy: 0,
            energyMax: 10,
            hp: 0,
            hpMax: 10,
            mining: 10,
            miningMax: null
        },
        x: -2,
        y: -1,
        xp: 209,
        id: 33,
        spiceMined: 167
    },
    {
        lvl: 3,
        nextActionTime: 1651566379,
        stats: {
            energy: 0,
            energyMax: 10,
            hp: 0,
            hpMax: 10,
            mining: 10,
            miningMax: null
        },
        x: -2,
        y: -1,
        xp: 209,
        id: 34,
        spiceMined: 167
    },
    {
        lvl: 3,
        nextActionTime: 1651566379,
        stats: {
            energy: 0,
            energyMax: 10,
            hp: 0,
            hpMax: 10,
            mining: 10,
            miningMax: null
        },
        x: -2,
        y: -1,
        xp: 209,
        id: 35,
        spiceMined: 167
    }
]

const ListPlayers = (): JSX.Element => {
    const gameContext = useContext(GameContext);
    const { tileForPlayersList } = gameContext;
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [lastFetch, setlastFetch] = useState<number>(Date.now());
    const [loading, setLoading] = useState<boolean>(true);
    const [listOfPlayers, setListOfPlayers] = useState<any[]>([]);


    useEffect(() => {
        if (!tileForPlayersList) return;

        // for fix phaser update function re-calls
        if (Date.now() - lastFetch < 1000 && !isFirstTime) return;

        (async () => {
            setLoading(true);
            console.log("refresh players");
            setlastFetch(Date.now());
            setIsFirstTime(false);

            // TODO: Get players from Contract/API
            const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))
            await waitFor(1000);

            setListOfPlayers(testListOfPlayers);
            setLoading(false);
        })()
    }, [tileForPlayersList]);

    const renderList = () => {
        return listOfPlayers.map((p) => {
            return (
                <div key={p.id} className={styles.card}>
                    <div className={styles.avatar}>
                        <img src="/assets/nft_avatar.png" alt="nft image" />
                    </div>
                    <div className={styles.content}>
                        <p># NO NAME</p>
                        <div className={styles.stats}>
                            <div className={styles.info}>
                                <img src="/assets/hearth_v2.png" alt="hearth icon" />
                                <p>3025</p>
                            </div>
                            <div className={styles.info}>
                                <img src="/assets/ligth_v2.png" alt="ligth icon" />
                                <p>3025</p>
                            </div>
                            <div className={styles.info}>
                                <img src="/assets/spice_v2.png" alt="spice icon" />
                                <p>230453</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={styles.btnFight}
                        onClick={() => {
                            console.log("figth again", p.id)
                        }}
                    >
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={styles.container}>
            <img className={styles.imgContainer} src="/assets/player_list_container.png" alt="player list container" />
            <div className={styles.playersWrapper}>
                {loading ? (
                    <Spinner animation="border" style={{ color: "white" }} />
                ) : (
                    <>
                        {tileForPlayersList.x}, {tileForPlayersList.y}
                        <div className={styles.players}>
                            {renderList()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ListPlayers;
