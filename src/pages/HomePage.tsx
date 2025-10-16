import React from "react";
import { Link } from "react-router-dom";
import image from "../assets/images/homeImg.png";
import "../styles/homePage.css";

const LINKS = ["About", "Contact", "Events"];

const HomePage: React.FC = () => {
	return (
		<div className="homeContainer">
			<div className="homeBackgroundContainer">
				<img src={image} alt="Home" className="homeImage" />
			</div>

			<div className="homeOverlay">
				<div className="homeSubscribeContainer">
					<p className="homeSubscribeText">
						Subscribe to our email newsletter to stay up to date with the latest
						news.
					</p>
					<div className="homeSubscribeFormContainer">
						<input
							type="text"
							placeholder="Enter your email"
							className="homeSubscribeInput"
						/>
						<button className="homeSubscribeButton">Subscribe</button>
					</div>
				</div>
				<Link to="/shop" className="homeShopLinkContainer">
					<p className="homeShopLink">Go to shop</p>
				</Link>
			</div>

			<div className="homeLinksContainer">
				<div className="homeLinksInnerContainer">
					{LINKS.map((link) => (
						<p className="homeLink" key={link}>
							{link}
						</p>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
