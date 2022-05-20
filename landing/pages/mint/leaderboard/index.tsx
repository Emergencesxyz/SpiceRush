import type {GetServerSideProps, NextPage} from "next";
import Link from 'next/link'
import Header from "../../../components/HeaderMint/HeaderMint";
import { useState, useEffect } from "react";
import styles from "../../mint/mint.module.scss";
import { Table, Button } from "react-bootstrap";

interface LeaderboardPageProps {
    datasorted: {
        code: number
        address: string
        totalreferred: number
    }[];
}

const Leaderboard: NextPage<{datasorted : any}> = ({ datasorted } : LeaderboardPageProps) => {

    const [isMobile, setIsmobile] = useState<boolean>(false);
    const [isMapLimit, setIsMapLimit] = useState<number>(5);

    useEffect(() => {
        if (window.matchMedia("(max-width: 600px)").matches) {
          setIsmobile(true);
        }
      }, []);

      const incrementLeaderboard = () => {
        setIsMapLimit((prevMapLimit) => prevMapLimit + 5)
      }

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
            <Table style={{border: "1px solid white", width: "90vw", color: "white", marginTop: "100px", overflow: "hidden"}} responsive>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Referrals number</th>
                        <th>Referral link</th>
                    </tr>
                </thead>
                <tbody>
            {datasorted.slice(0, isMapLimit).map((item, index) => ( 
                <tr key={item.code} style={{border: "1px solid white"}}>
                    <td>{item.address.slice(0, 7) + "..." + item.address.slice(34)}</td>
                    <td>{item.totalreferred}</td> 
                    <td><Link href={'https://www.spicerush.io/mint?number=' + item.code}>{'sp...sh.io/mint?number=' + item.code}</Link></td>
                </tr>
            ))}
            </tbody>
        </Table>
        <div className={styles.buttonContainer}>
          {isMapLimit < 55 && <Button className={styles.button2} style={{ fontWeight: "bold", fontSize: "28px" }} onClick={() => incrementLeaderboard()}>More</Button>}
        </div>
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              marginTop: "20px"
            }}>
        <Link href="/mint"><a className={styles.link}><img
              style={{
                width: "16px",
                height: "16px",
                marginBottom: "5px",
                marginRight: "5px",
               
              }}
              src="/pictures/Polygon4.png"
              alt="polygon"
            ></img>Mint Your Own </a></Link></div>
        </div>
        </div>
    )

}

 export const getServerSideProps: GetServerSideProps = async() => {
    const res = await fetch(`http://localhost:3000/api/leaderboard`)
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