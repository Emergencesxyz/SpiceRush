import { useState, FunctionComponent } from "react";
import {
  Nav,
  Navbar,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import styles from "./Header.module.scss";
interface Props {
  currentElementIndexInViewport?: number;
}

const Header: FunctionComponent<Props> = ({
  currentElementIndexInViewport: index,
}): JSX.Element => {
  const [clickDiscord, setClickDiscord] = useState<boolean>(false);
  const [clickTiktok, setClickTiktok] = useState<boolean>(false);
  const [isActive1, setIsActive1] = useState<boolean>(false);
  const [isActive2, setIsActive2] = useState<boolean>(false);
  const [isActive3, setIsActive3] = useState<boolean>(false);

  return (
    <Navbar
      expand="xl"
      fixed="top"
      className="p-0"
      variant="dark"
      collapseOnSelect
      style={{ width: "100vw" }}
    >
      <Container className={styles.navContainer}>
        <Nav.Link className={styles.brand} href="/#topSection">
          <h1>
            <img
              src="/pictures/golem_logo.png"
              alt="Apinator"
              style={{ maxWidth: "5em" }}
            />
          </h1>
        </Nav.Link>
        <Navbar.Toggle aria-controls="navbar" style={{ border: "none" }}>
          <img
            alt="menu burger"
            width="30"
            height="30"
            src="/pictures/burger.png"
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar" className=" justify-content-between">
          <Nav className={styles.navBar}>
            <Nav.Link
              href="https://metapolis.gitbook.io/apinator-2042-v1/"
              target="_blank"
            >
              <div className="d-flex flex-column p-1">
                <span>Whitepaper</span>
              </div>
            </Nav.Link>

            <Nav.Link
              href="https://metapolis.gitbook.io/apinator-2042-v1/gameplay/spice"
              target="_blank"
            >
              <div className="d-flex flex-column p-1">
                <span>Token</span>
              </div>
            </Nav.Link>
            <Nav.Link onClick={() => setIsActive1(!isActive1)}>
              <div className="d-flex flex-column p-1 text-center">
                <span>Staking</span>
                {isActive1 && <span>SOON</span>}
              </div>
            </Nav.Link>

            <Nav.Link onClick={() => setIsActive2(!isActive2)}>
              <div className="d-flex flex-column p-1 text-center">
                <span>Buy land</span>
                {isActive2 && <span>SOON</span>}
              </div>
            </Nav.Link>

            <Nav.Link onClick={() => setIsActive3(!isActive3)}>
              <div className="d-flex flex-column p-1 text-center">
                <span>Buy NFT</span>
                {isActive3 && <span>SOON</span>}
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
