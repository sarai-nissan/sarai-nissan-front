import { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../../components/skeleton/Skeleton";
import HomeEmail from "./components/homeEmail/HomeEmail";
import image from "../../assets/images/homeImg.png";

import "./homePage.css";

const LINKS = ["About", "Contact", "Event"];

const HomePage: React.FC = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className="homePageContainer">
			<div className="homePageBackgroundContainer">
				{!isLoaded && <Skeleton className="homePageImage" />}

				<img
					src={image}
					alt="Home"
					className="homePageImage"
					style={{ display: isLoaded ? "block" : "none" }}
					onLoad={() => setIsLoaded(true)}
				/>
			</div>

			<HomeEmail />

			<div className="homePageLinksContainer">
				<div className="homePageLinksInnerContainer">
					{LINKS.map((link) => (
						<Link to={`/${link.toLowerCase()}`} key={link}>
							<p className="homePageLink">{link}</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
