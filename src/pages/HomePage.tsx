import { Link } from "react-router-dom";
import HomeEmail from "../components/homeEmail/HomeEmail";
import image from "../assets/images/homeImg.png";
import "../styles/homePage.css";

const LINKS = ["About", "Contact", "Event"];

const HomePage: React.FC = () => {
	return (
		<div className="homeContainer">
			<div className="homeBackgroundContainer">
				<img src={image} alt="Home" className="homeImage" />
			</div>

			<HomeEmail />

			<div className="homeLinksContainer">
				<div className="homeLinksInnerContainer">
					{LINKS.map((link) => (
						<Link to={`/${link.toLowerCase()}`} key={link}>
							<p className="homeLink" key={link}>
								{link}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
