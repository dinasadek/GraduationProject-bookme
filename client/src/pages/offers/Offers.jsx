import "./offers.css";
import React, { useState , useContext,useRef, useEffect} from 'react';
// import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Link } from "react-router-dom";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

// import { useNavigate } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { Provider } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
// import Room from "../../../../api/models/Room";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";




const HolidayOffers = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  //const [hotelsWithOffers, setHotelsWithOffers] = useState([]);
  const [hotelsWithOffers, setHotelsWithOffers] = useState([]);
  const [cityOffers, setCityOffers] = useState([]);
  const [cardStates, setCardStates] = useState([]);
  const [summerOfferCities, setSummerOfferCities] = useState([]);
  const [winterOfferCities, setWinterOfferCities] = useState([]);
  const [springOfferCities, setSpringOfferCities] = useState([]);
  const [autumnOfferCities, setAutumnOfferCities] = useState([]);
  const [aidAlFitrOfferCities, setAidAlFitrOfferCities] = useState([]);
  const [aidAlAdhaOfferCities, setAidAlAdhaOfferCities] = useState([]);
  const [weekendOfferCities, setWeekendOfferCities] = useState([]);

  
  
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);

  // const navigate = useNavigate();
  // const dispatch = useDispatch();


  // const history = useHistory();  // Initialize useHistory
  //const { data, loading, error } = useFetch(`/hotels/find/${id}`);
  // const [openDate, setOpenDate] = useState(false);
  // const [dates, setDates] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  // const [adults, setAdults] = useState(1);
  // const [children, setChildren] = useState(0);
  // const [rooms, setRooms] = useState(1);




  // const calendarRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (calendarRef.current && !calendarRef.current.contains(event.target)) {
  //       setOpenDate(false);
  //     }
  //   };
  
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [calendarRef]);
  // <button className="book-now-button" onClick={() => handleBookNowClick(hotel._id)}>Book Now</button>

  const offers = [
    {
      title: 'Summer Offers',
      brief: 'Enjoy the summer with our special offers!',
      details: 'Get amazing discounts on beach resorts and more.',
      cities: [
        { city: 'Miami', details: 'Experience the vibrant nightlife and beautiful beaches of Miami.' },
        { city: 'Los Angeles', details: 'Discover the sunny weather and iconic landmarks of LA.' },
      ],
    },
    {
      title: 'Winter Offers',
      brief: 'Warm up with our winter deals!',
      details: 'Special prices on ski resorts and cozy cabins.',
      cities: [
        { city: 'Aspen', details: 'Enjoy the best ski resorts and winter sports in Aspen.' },
        { city: 'Whistler', details: 'Explore the stunning winter landscapes and activities in Whistler.' },
      ],
    },
    {
      title: 'Weekend Offers',
      brief: 'Wow',
      details: 'Special prices on ski resorts and cozy cabins.',
      cities: [
        { city: 'Aspen', details: 'Enjoy the best ski resorts and winter sports in Aspen.' },
        { city: 'Whistler', details: 'Explore the stunning winter landscapes and activities in Whistler.' },
      ],
    },
    // Add other offers here...
  ];

  const PrevArrow = (props) => {
    const { onClick } = props;
    return <button className="slick-arrow slick-prev" onClick={onClick}>‹</button>;
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return <button className="slick-arrow slick-next" onClick={onClick}>›</button>;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };



  // const handleShowCityOffersClick = (city) => {
  //   setSelectedCity(city);
  // };


  const fetchofferKind = async () => {
    try {
      const response = await axios.get("/hotels/roomsWithOffers");
      const summerCities = [];
      const winterCities = [];
      const springCities = [];
      const autumnCities = [];
      const aidAlFitrCities = [];
      const aidAlAdhaCities = [];
      const weekendCities = [];


      response.data.forEach(hotel => {
        const city = hotel.hotelCity;
        const offerKind = hotel.offerKind;

        if (offerKind === "summer offer") {
          if (!summerCities.some(cityOffer => cityOffer.city === city)) {
            summerCities.push({
              city,
              hotels: [hotel],
            });
          } else {
            const cityOffer = summerCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        } else if (offerKind === "winter offer") {
          if (!winterCities.some(cityOffer => cityOffer.city === city)) {
            winterCities.push({
              city,
              hotels: [hotel],
            });
          } else {
            const cityOffer = winterCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        }

        else if (offerKind === "spring offer") {
          if (!springCities.some(cityOffer => cityOffer.city === city)) {
            springCities.push({ city, hotels: [hotel] });
          } else {
            const cityOffer = springCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        } else if (offerKind === "autumn offer") {
          if (!autumnCities.some(cityOffer => cityOffer.city === city)) {
            autumnCities.push({ city, hotels: [hotel] });
          } else {
            const cityOffer = autumnCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        } else if (offerKind === "aid al-fitr offer") {
          if (!aidAlFitrCities.some(cityOffer => cityOffer.city === city)) {
            aidAlFitrCities.push({ city, hotels: [hotel] });
          } else {
            const cityOffer = aidAlFitrCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        } else if (offerKind === "aid al-adha offer") {
          if (!aidAlAdhaCities.some(cityOffer => cityOffer.city === city)) {
            aidAlAdhaCities.push({ city, hotels: [hotel] });
          } else {
            const cityOffer = aidAlAdhaCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        } else if (offerKind === "weekend offer") {
          if (!weekendCities.some(cityOffer => cityOffer.city === city)) {
            weekendCities.push({ city, hotels: [hotel] });
          } else {
            const cityOffer = weekendCities.find(cityOffer => cityOffer.city === city);
            cityOffer.hotels.push(hotel);
          }
        }
        
      });

      setSummerOfferCities(summerCities);
      setWinterOfferCities(winterCities);
      setSpringOfferCities(springCities);
      setAutumnOfferCities(autumnCities);
      setAidAlFitrOfferCities(aidAlFitrCities);
      setAidAlAdhaOfferCities(aidAlAdhaCities);
      setWeekendOfferCities(weekendCities);
    } catch (error) {
      console.error("Error fetching rooms with offers: ", error);
    }
  };

  useEffect(() => {
    fetchofferKind();
  }, []);


  useEffect(() => {
    const fetchRoomsWithOffers = async () => {
      try {
        const response = await axios.get("/hotels/roomsWithOffers");
        const cities = response.data.reduce((acc, hotel) => {
          const city = hotel.hotelCity;
          const offerKind = hotel.offerKind; 
          if (!acc[city]) {
            acc[city] = [];
          }
          acc[city].push(hotel);
          return acc;
        }, {});
        setCityOffers(Object.entries(cities).map(([city, hotels]) => ({ city, hotels })));
      } catch (error) {
        console.error("Error fetching rooms with offers: ", error);
      }
    };
    fetchRoomsWithOffers();
  }, []);

  useEffect(() => {
    if (cityOffers.length > 0) {
      setCardStates(cityOffers.flatMap(cityOffer => 
        cityOffer.hotels.map(hotel => ({
          hotelId: hotel.hotelId,
          openDate: false,
          dates: [{
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          }],
          adults: 1,
          children: 0,
          rooms: 1,
        }))
      ));
    }
  }, [cityOffers]);

  const handleCardStateChange = (hotelId, newState) => {
    setCardStates(prevStates => prevStates.map(state => 
      state.hotelId === hotelId ? { ...state, ...newState } : state
    ));
  };


 

  const handleShowOffersClick = (cities) => {
    setSelectedOffer(cities);
    setSelectedCity(null);
  };

  const handleShowCityOffersClick = (city) => {
    setSelectedCity(city);
  };

  // const handleShowCityOffersClick = (city) => {
  //   setSelectedCity(city);
  // };


  // const handleBookNowClick = (hotelId) => {
  //   history.push(`/hotel/${hotelId}`);  // Redirect to the hotel page
  // };

  
  // // Example usage
  // findHotelsWithOffers().then(hotelsWithOffers => {
  //   console.log("Hotels with offers:", hotelsWithOffers);
  // });

   //Handle search action and navigate to hotels page with user inputs
    const handleSearch = (destination, dates, options, hotel) => {
     dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
     navigate(`/hotels/${hotel.hotelId}`);
   };

  // const handleSearchClick = (offer) => {
  //   dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options ,discount } });
  //   //navigate("/hotels", { state: { destination, dates, options } });
  //   navigate(`/hotels/${offer.hotel_id}`);
  // };



  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="container">
      
      <h2>Holiday Offers</h2>
      <p>Celebrate and save, what a great opportunity!</p>
      <Slider {...sliderSettings}>
        {[
          {
            title: 'Summer Offers',
            brief: 'Enjoy the summer with our special offers!',
            details: 'Get amazing discounts on beach resorts and more.',
            onClick: () => handleShowOffersClick(summerOfferCities),
          },
          {
            title: 'Winter Offers',
            brief: 'Warm up with our winter deals!',
            details: 'Special prices on ski resorts and cozy cabins.',
            onClick: () => handleShowOffersClick(winterOfferCities),
          },
          {
            title: 'Spring Offers',
            brief: 'Bloom with our spring deals!',
            details: 'Special discounts on garden resorts and more.',
            onClick: () => handleShowOffersClick(springOfferCities),
          },
          {
            title: 'Autumn Offers',
            brief: 'Fall into savings with our autumn deals!',
            details: 'Enjoy great prices on forest retreats and more.',
            onClick: () => handleShowOffersClick(autumnOfferCities),
          },
          {
            title: 'Aid al-Fitr Offers',
            brief: 'Celebrate Aid al-Fitr with our special offers!',
            details: 'Exclusive deals for a joyful celebration.',
            onClick: () => handleShowOffersClick(aidAlFitrOfferCities),
          },
          {
            title: 'Aid al-Adha Offers',
            brief: 'Celebrate Aid al-Adha with our special offers!',
            details: 'Exclusive deals for a joyful celebration.',
            onClick: () => handleShowOffersClick(aidAlAdhaOfferCities),
          },
          {
            title: 'Weekend Offers',
            brief: 'Enjoy your weekends with our special offers!',
            details: 'Get the best prices for weekend getaways.',
            onClick: () => handleShowOffersClick(weekendOfferCities),
          }
        ].map((offer, index) => (
          <div key={index} className="card">
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-brief">{offer.brief}</p>
            <p className="offer-details">{offer.details}</p>
            {(() => {
              if (offer.title === 'Summer Offers' && summerOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>No summer offers available</p>;
              } else if (offer.title === 'Winter Offers' && winterOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>No winter offers available</p>;
              }else if (offer.title === 'Spring Offers' && springOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>No Spring offers available</p>;
              }else if (offer.title === 'Autumn Offers' && autumnOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>No Autumn offers available</p>;
              }else if (offer.title === 'Aid al-Fitr Offers' && aidAlFitrOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>No Aid al-Fitr offers available</p>;
              }else if (offer.title === 'Aid al-Adha Offers' && aidAlAdhaOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>No Aid al-Adha offers available</p>;
              }else if (offer.title === 'Weekend Offers' && weekendOfferCities.length === 0) {
                return <p style={{ color: 'red', fontWeight: 'bold' }}>no Weekend offers available</p>;
              } else {
                return (
                  <button className="availability-button" onClick={offer.onClick}>Show Offers</button>
                );
              }
           })()}



            {/* <button className="availability-button" onClick={offer.onClick}>Show Offers</button> */}
          </div>
        ))}
      </Slider>
      {selectedOffer && !selectedCity && (
        <div className="city-slider">
          <h3>Available Cities</h3>
          <Slider {...sliderSettings}>
            {selectedOffer.map((cityOffer) => (
              <div key={cityOffer.city} className="card">
                <h3 className="city-title">{cityOffer.city}</h3>
                <button className="availability-button" onClick={() => handleShowCityOffersClick(cityOffer)}>Show Offers</button>
              </div>
            ))}
          </Slider>
        </div>
      )}
      {selectedCity && (
        <div className="offer-details-slider">
          <h3>{selectedCity.city} - Available Offers</h3>
          <Slider {...sliderSettings}>
            {selectedCity.hotels.map((hotel) => {
              // Check if hotel is already displayed
              // if (displayedHotels.includes(hotel.hotelId)) {
              //    return null; // Skip this hotel
              // }
              //  // Add hotel to displayed hotels
              // setDisplayedHotels(prevDisplayedHotels => [...prevDisplayedHotels, hotel.hotelId]);
        
              console.log("Rendering hotel:", hotel.hotelName, hotel.hotelId);
              const cardState = cardStates.find(state => state.hotelId === hotel.hotelId) || {
                hotelId: hotel.hotelId,
                openDate: false,
                dates: [{
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                }],
                adults: 1,
                children: 0,
                rooms: 1,
              };
              return (
                <div key={hotel.hotelId} className="card">
                  <h3 className="offer-title">{hotel.hotelName}</h3>
                  {hotel.offers.map((offer, offerIndex) => (
                    <div key={offerIndex} className="offer-content">
                      <h4 className="offer-header">{offer.title}</h4>
                      <p className="offer-advertise">
                        <strong>Enjoy an amazing deal!</strong><br />
                        <span className="room-title">the offer is on room: {hotel.roomTitle}</span><br />
                        <span className="price-before">Was: ${offer.priceBefore}</span><br />
                        <span className="price-after">Now: ${offer.priceAfter}</span><br />
                        <span className="percentage-saving">Save: {offer.percentageSaving}%</span><br />
                        <span className="offer-duration">
                          Offer valid from {new Date(offer.from).toLocaleDateString()} to {new Date(offer.to).toLocaleDateString()}
                        </span><br/>
                        <span className="rOfferNote">Note: If selected dates fall outside the offer period, the additional days will be charged at the original room price.</span>
                      </p>
                      <div className="input-container">
                        <label>Check-in Date:</label>
                        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                        <span
                          onClick={() => handleCardStateChange(hotel.hotelId, { openDate: !cardState.openDate })}
                          className="headerSearchText"
                        >{`${format(cardState.dates[0].startDate, "MM/dd/yyyy")} to ${format(cardState.dates[0].endDate, "MM/dd/yyyy")}`}</span>
                        {cardState.openDate && (
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => handleCardStateChange(hotel.hotelId, { dates: [item.selection] })}
                            moveRangeOnFirstSelection={false}
                            ranges={cardState.dates}
                            className="date"
                            minDate={new Date()}
                          />
                        )}
                      </div>
                      <div className="input-container adults-input">
                        <label>Number of Adults:</label>
                        <input
                          type="number"
                          value={cardState.adults}
                          onChange={e => handleCardStateChange(hotel.hotelId, { adults: parseInt(e.target.value) })}
                          min="1"
                          placeholder="Enter number of adults"
                        />
                      </div>
                      <div className="input-container">
                        <label>Number of Children:</label>
                        <input
                          type="number"
                          value={cardState.children}
                          onChange={e => handleCardStateChange(hotel.hotelId, { children: parseInt(e.target.value) })}
                          min="0"
                          placeholder="Enter number of children"
                        />
                      </div>
                      <div className="input-container">
                        <label>Number of Rooms:</label>
                        <input
                          type="number"
                          value={cardState.rooms}
                          onChange={e => handleCardStateChange(hotel.hotelId, { rooms: parseInt(e.target.value) })}
                          min="1"
                          placeholder="Enter number of rooms"
                        />
                      </div>
                      <button
                        className="availability-button"
                        onClick={() => handleSearch(hotel.hotelCity, cardState.dates, { adults: cardState.adults, children: cardState.children, room: cardState.rooms }, hotel)}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </Slider>
        </div>
      )}
      
    </div>
    <MailList />
    <Footer />
    </div>
    
  );
};
export default HolidayOffers;