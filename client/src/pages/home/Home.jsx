import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const userId =user._id;
  const [image, setImage] = useState();
    
  useEffect(() => {


    const getUserImage = async () => {
        try {
          const response = await fetch(`http://localhost:8800/api/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            if (user.img!==""){

                setImage(user.img);
            }else{
                setImage(null);
            }
            
          } else {
            throw new Error("Failed to fetch user image");
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      };
      getUserImage();
    }, [userId]);
    
  return (
    <div>
      <Navbar image={image}/>
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <h1 className="homeTitle">Top-rated hotels</h1>
        <PropertyList/>
        <h1 className="homeTitle"> Popular searches</h1>
        <FeaturedProperties/>
        <MailList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
