import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chart from "../../components/chart/Chart";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import List from "../../components/table/Table";
import "./single.scss";

const Single = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const GetUser = async () => {
      setLoading(true); // Set loading state to true before fetching data
      try {
        const response = await axios.get(`http://localhost:8800/api/users/${userId}`);
        setUser(response.data);
        setLoading(false); // Set loading state to false after successful data fetch
      } catch (err) {
        setError(err); // Set error state if fetch fails
        setLoading(false); // Set loading state to false on error
      }
    };
    GetUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
            <img
                src={user.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{user.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {user.country}{' , '}{user.city}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">{user.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">Last Bookings</h1>
          <List userId={userId}/>
        </div>
      </div>
    </div>
  );
};

export default Single;
