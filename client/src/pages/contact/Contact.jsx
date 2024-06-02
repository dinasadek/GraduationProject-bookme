import { useContext, useState } from "react";
import Footer from '../../components/footer/Footer';
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import './contact.css'; // Importing CSS for styling
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const { loading, error} = useContext(AuthContext);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // Ideally, here you would send the data to the server
        alert('Thank you for your message. We will get back to you shortly.');
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
      <div>
        <Navbar />
        <Header type={"list"} />
        <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Contact Us</h2>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <label htmlFor="message">Message</label>
            <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
            ></textarea>
            <button disabled={loading} onClick={handleSubmit} className="3Button">Send</button>
            {error && <span>{error.message}</span>}
        </form>
        <div className="End_Page">
        <MailList />
        <Footer />
      </div>

        </div>
    );
};

export default Contact;