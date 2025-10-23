import { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../components/skeleton/Skeleton";
import HomeEmail from "../components/homeEmail/HomeEmail";
import image from "../assets/images/homeImg.png";
import "../styles/homePage.css";

const LINKS = ["About", "Contact", "Event"];

const HomePage: React.FC = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className="homeContainer">
			<div className="homeBackgroundContainer">
				{!isLoaded && <Skeleton className="homeImage" />}

				<img
					src={image}
					alt="Home"
					className="homeImage"
					style={{ display: isLoaded ? "block" : "none" }}
					onLoad={() => setIsLoaded(true)}
				/>
			</div>

			<HomeEmail />

			<div className="homeLinksContainer">
				<div className="homeLinksInnerContainer">
					{LINKS.map((link) => (
						<Link to={`/${link.toLowerCase()}`} key={link}>
							<p className="homeLink">{link}</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
