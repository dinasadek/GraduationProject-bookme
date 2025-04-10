import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.scss";

import { useContext } from "react";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
        <Link to={`/users/${user._id}`} style={{ textDecoration: "none" }}>
          <div className="item">
            {user.username}
          
          </div></Link>
          
          <Link to={`/users/${user._id}`} style={{ textDecoration: "none" }}>
          <div className="item">
            <img
              src={user.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
              alt=""
              className="avatar"
            />
          </div></Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
