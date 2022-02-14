import styles from "./NFTimage.module.scss";
import { FunctionComponent, useEffect, useState } from "react";
import { Container, Row, ListGroup, ListGroupItem } from "react-bootstrap";

interface Props {
  nftQuantity: number;
  unitPrice: number;
  supply: number;
}

const NFTimage: FunctionComponent<Props> = ({
  nftQuantity,
  unitPrice,
  supply,
}): JSX.Element => {
  const [totalPrice, setTotalPrice] = useState<number>(0.12);

  useEffect(() => {
    setTotalPrice(unitPrice * nftQuantity);
    setTotalPrice(Math.round(unitPrice * nftQuantity * 100) / 100);
  }, [nftQuantity, unitPrice]);

  return (
    <Container className={styles.container}>
      <Row>
        <ListGroup className="mt-4 mb-3" variant="flush">
          <ListGroupItem className={styles.priceText}>
            Price: {totalPrice} ETH
          </ListGroupItem>
          {/* <ListGroupItem className={styles.mintText}>
            MINTED: {supply}/ 8888:
          </ListGroupItem> */}
        </ListGroup>
      </Row>
    </Container>
  );
};

export default NFTimage;
