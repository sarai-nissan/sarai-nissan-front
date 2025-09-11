import React from "react";
import Mailing from "../components/mailing/Mailing";
import StoreBlock from "../components/storeblock/Storeblock";
import "../styles/homePage.css";

const HomePage: React.FC = () => {
	return (
		<div className="homeContainer">
			<Mailing />
			<StoreBlock />
		</div>
	);
};

export default HomePage;
