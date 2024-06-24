import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="hotel" />
          <Widget type="room" />
        </div>
        <div className="charts">
          <h2>Hotels Analysis Charts</h2>
          <div className="chart">
            <h3>Positive and Negative Comments per Hotel</h3>
            <img src="/plots/positive_negative_comments.png" alt="Positive and Negative Comments per Hotel" />
          </div>
          <div className="chart">
            <h3>Heatmap of Hotel Comments, Ratings, and Ratios</h3>
            <img src="/plots/heatmap_hotel_comments.png" alt="Heatmap of Hotel Comments, Ratings, and Ratios" />
          </div>
          <div className="chart">
            <h3>Heatmap of Average Rating and Positive Ratio</h3>
            <img src="/plots/heatmap_rating_ratio.png" alt="Heatmap of Average Rating and Positive Ratio" />
          </div>
          <div className="chart">
            <h3>Overall Sentiment Distribution</h3>
            <img src="/plots/sentiment_distribution.png" alt="Overall Sentiment Distribution" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
