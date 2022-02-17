import styles from "./GameScreen.module.scss";

import { Row, Button, Col } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import IconGame from "./IconGame";

const ActionBox: FunctionComponent = ({ tiles, character }): JSX.Element => {
  const { account, library } = useWeb3React();
  const blockchainService = new BlockchainService(account);

  const moveCharacter = async (e) => {
    if (e.target.name === "right")
      return await blockchainService.moveCharacter(
        character.x,
        character.y + 1,
        library
      );
  };

  return (
    <>
      <div className={styles.actionBox}>
        <h3>Actions</h3>

        <div className={styles.actionBoxRow}>
          <Button>up</Button>
          <Row>
            <Col>
              <Button>left</Button>
            </Col>

            <Col>
              <Button onClick={moveCharacter} name="right">
                right
              </Button>
            </Col>
          </Row>

          <Button>down</Button>
        </div>

        <div className={styles.actionBoxRow}>
          <Button className={styles.actionBoxButton}>
            <IconGame name="mining" />
            Mine
          </Button>
          <Button>
            <IconGame name="rest2" /> Rest
          </Button>
        </div>
      </div>
    </>
  );
};

export default ActionBox;
