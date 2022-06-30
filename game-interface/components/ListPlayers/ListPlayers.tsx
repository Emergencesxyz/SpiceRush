import styles from "./ListPlayers.module.scss";
import { GameContext } from "../../context/GameContext";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import BlockchainService from "../../services/BlockchainService";
import { useWeb3React } from "@web3-react/core";

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
    const context = useWeb3React();
    const { account } = context;
    const gameContext = useContext(GameContext);
    const { playersInTile, selectedTile } = gameContext;
    const blockchainService = new BlockchainService(account);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [lastFetch, setlastFetch] = useState<number>(Date.now());
    const [loading, setLoading] = useState<boolean>(true);
    const [listOfPlayers, setListOfPlayers] = useState<any[]>([]);


    useEffect(() => {
        // For fix phaser update function re-calls
        if (Date.now() - lastFetch < 1000 && !isFirstTime) return;
        setLoading(true);

        (async () => {
            if (!playersInTile) return setListOfPlayers([]);

            setlastFetch(Date.now());
            setIsFirstTime(false);

            const getPlayers = await blockchainService.getPlayersInTile(playersInTile);
            setListOfPlayers(getPlayers);
        })()
        setLoading(false);
    }, [playersInTile]);

    const renderList = () => {
        if (!listOfPlayers.length) return (
            <h4>No one here</h4>
        );

        return listOfPlayers.map((p) => {
            return (
                <div key={p.id} className={styles.card}>
                    <div className={styles.avatar}>
                        <img src="/assets/nft_avatar.png" alt="nft image" />
                    </div>
                    <div className={styles.content}>
                        <p>ID #{p.id}</p>
                        <div className={styles.stats}>
                            <div className={styles.info}>
                                <img src="/assets/hearth_v2.png" alt="hearth icon" />
                                <p>{p.hp}</p>
                            </div>
                            <div className={styles.info}>
                                <img src="/assets/ligth_v2.png" alt="ligth icon" />
                                <p>{p.energy}</p>
                            </div>
                            <div className={styles.info}>
                                <img src="/assets/spice_v2.png" alt="spice icon" />
                                <p>{p.oreBalance}</p>
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
                        {selectedTile.x}, {selectedTile.y}
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
