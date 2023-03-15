import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = (): JSX.Element => {
  const [active, setActive] = useState<boolean>(false);
  const windowResizeHandler = () => {
    if (window.innerWidth > 800) setActive(true);
    else setActive(false);
  };

  useEffect(() => {
    windowResizeHandler();
    window.addEventListener("resize", windowResizeHandler);
  }, []);

  const show = active ? "flex" : "none";
  const barsWidth = active ? "37px" : "30px";
  const transformTop = active ? "rotate(45deg)" : "";
  const transformBottom = active ? "rotate(-45deg)" : "";
  const left = active ? "-30px" : "";
  const opacity = active ? "0" : "1";
  const backgroundColor = active ? "#ffffff" : "#000000";

  return (
    <nav>
      <div id="links" style={{ display: show }}>
        <Link to="/" className="link" onClick={() => windowResizeHandler()}>
          Home
        </Link>
        <Link
          to="/matches"
          className="link"
          onClick={() => windowResizeHandler()}
        >
          Matches
        </Link>
        <Link
          to="/clubs"
          className="link"
          onClick={() => windowResizeHandler()}
        >
          Clubs
        </Link>
        <Link to="/2d" className="link" onClick={() => windowResizeHandler()}>
          2D
        </Link>
        <Link to="/3d" className="link" onClick={() => windowResizeHandler()}>
          3D
        </Link>
      </div>
      <div id="hamburger">
        <div id="box" onClick={() => setActive((prevActive) => !prevActive)}>
          <span
            className="bar top"
            style={{
              width: barsWidth,
              transform: transformTop,
              backgroundColor: backgroundColor,
            }}
          ></span>
          <span
            className="bar middle"
            style={{
              left: left,
              opacity: opacity,
              backgroundColor: backgroundColor,
            }}
          ></span>
          <span
            className="bar bottom"
            style={{
              width: barsWidth,
              transform: transformBottom,
              backgroundColor: backgroundColor,
            }}
          ></span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
