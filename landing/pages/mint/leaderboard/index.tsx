import type {GetServerSideProps, NextPage} from "next";
import Header from "../../../components/HeaderMint/HeaderMint";
import { useState, useEffect } from "react";
import styles from "../../mint/mint.module.scss";
import { Table } from "react-bootstrap";

interface LeaderboardPageProps {
    datasorted: {
        code: number
        address: string
        totalreferred: number
    }[];
}

const Leaderboard: NextPage<{datasorted : any}> = ({ datasorted } : LeaderboardPageProps) => {

    const [isMobile, setIsmobile] = useState<boolean>(false);

    useEffect(() => {
        if (window.matchMedia("(max-width: 600px)").matches) {
          setIsmobile(true);
        }
      }, []);

    return (
        <div className={styles.body}>
        <header>
          <Header isMobile={isMobile} />
        </header>
        <div className={styles.container}>
        <Table className={styles.table}>
            <tbody>
              <tr>
                <td colSpan={3} style={{ fontSize: "30px" }}>
                  <strong>APEx7</strong> Referral Leaderboard
                </td>
              </tr>
              </tbody>
              </Table>
            <Table style={{border: "1px solid white", width: "90vw", color: "white", marginTop: "100px"}} responsive>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Referrals number</th>
                    </tr>
                </thead>
                <tbody>
            {datasorted.map((item, index) => ( 
                <tr key={item.code} style={{border: "1px solid white"}}>
                    <td>{item.address}</td>
                    <td>{item.totalreferred}</td> 
                </tr>
            ))}
            </tbody>
        </Table>
        </div>
        </div>
    )

}

export const getServerSideProps: GetServerSideProps = async() => {
    const res = await fetch('http://vps-5a1fae51.vps.ovh.net:3001/')
    const data = await res.json();
    console.log(data)
    const datasorted = data.sort(function(a: any, b: any) {
        return parseFloat(b.totalreferred) - parseFloat(a.totalreferred);
    });

    return {
        props: {
            datasorted
        }
    }

    
  }


export default Leaderboard;