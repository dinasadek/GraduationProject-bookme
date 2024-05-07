import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  faHotel,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";

const Navbar = ({ image }) => {
  const { user,dispatch } = useContext(AuthContext);
  const [userImage, setUserImage] = useState();
    useEffect(() => {
        // Retrieve image URL from local storage
        setUserImage(user.img === "" ? (image) : (user.img));
    }, [image,user]);




  
  //const userId =user._id;
  //const [image, setImage] = useState();
  
  
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    <Navigate to ="/"/>
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <FontAwesomeIcon icon={faHotel} />
          <span className="logo"> Book Me</span>
        </Link>
        {user ? (
        <div className="navItems">
          <Link to="/profile">
          <img className="image" src={userImage || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" /></Link>
          
        
          <Link to="/profile" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="username">{user.username}</span>
          </Link>
          <Link to="/">
          <button className="navButton" onClick={handleLogout}>Logout</button></Link>
          
        </div>
      ) : (
        <div className="navItems">
          <Link to="/register">
          <button className="navButton">Register</button>
          </Link>
          <Link to="/login">
          <button className="navButton">Login</button>
          </Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default Navbar;
