import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = (): JSX.Element => {
  return (
    <nav>
      <Link to="/" className="link">
        Home
      </Link>
      <Link to="/clubs" className="link">
        Clubs
      </Link>
      <Link to="/2d" className="link">
        2D
      </Link>
      <Link to="/3d" className="link">
        3D
      </Link>
    </nav>
  );
};

export default NavBar;
