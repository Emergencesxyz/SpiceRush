import { useState, FunctionComponent } from "react";
import {
  Nav,
  Navbar,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import MusicPlayer from "../MusicPlayer/MusicPlayer"
import styles from "./Header.module.scss";
interface Props {
  currentElementIndexInViewport?: number;
  isMobile: boolean;
}

const Header: FunctionComponent<Props> = ({
  currentElementIndexInViewport: index,
  isMobile,
}): JSX.Element => {
  const [isActive0, setIsActive0] = useState<boolean>(false);
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
      style={{ width: "100vw", display:"flex" }}
    >
      <Container className={styles.navContainer}>
        {/* <Nav.Link className={styles.brand} href="/#topSection">
          <h1>
            <img
              src="/pictures/logo-test-2.png"
              alt="Apinator"
              style={{ maxWidth: "5em" }}
            />
          </h1>
        </Nav.Link> */}
        {isMobile &&<MusicPlayer />}
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
              href="https://golemdao.gitbook.io/spicerush/"
              target="_blank"
            >
              <div className={styles.titleBox}>
                <span>Whitepaper</span>
              </div>
            </Nav.Link>

            <Nav.Link
              onMouseEnter={() => setIsActive0(!isActive0)}
              onMouseLeave={() => setIsActive0(!isActive0)}
            >
              <div className={styles.titleBox}>
                <span>Token</span>
                {isMobile && <p>Coming soon</p>}
                {isActive0 && !isMobile && <p>Coming soon</p>}
              </div>
            </Nav.Link>
            <Nav.Link
              onMouseEnter={() => setIsActive1(!isActive1)}
              onMouseLeave={() => setIsActive1(!isActive1)}
            >
              <div className={styles.titleBox}>
                <span>Staking</span>
                {isMobile && <p>Coming soon</p>}
                {isActive1 && !isMobile && <p>Coming soon</p>}
              </div>
            </Nav.Link>

            <Nav.Link
              onMouseEnter={() => setIsActive2(!isActive2)}
              onMouseLeave={() => setIsActive2(!isActive2)}
            >
              <div className={styles.titleBox}>
                <span>Buy land</span>
                {isMobile && <p>Coming soon</p>}
                {isActive2 && !isMobile && <p>Coming soon</p>}
              </div>
            </Nav.Link>

            {isMobile && (
              <Nav.Link href="https://twitter.com/Spice_Rush" target="_blank">
                <div className={styles.titleBox}>
                  <span>Twitter</span>
                </div>
              </Nav.Link>
            )}
            {isMobile && (
              <Nav.Link href="https://discord.gg/MZMPRgWsuZ" target="_blank">
                <div className={styles.titleBox}>
                  <span>Discord</span>
                </div>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
