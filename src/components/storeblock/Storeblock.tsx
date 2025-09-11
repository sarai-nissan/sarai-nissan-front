import React from "react";
import { Link } from "react-router-dom";
import "./storeblock.css";

const StoreBlock: React.FC = () => {
	return (
		<div className="storeBlockContainer">
			<Link to="/shop">
				<p className="storeBlockText">{"go to store ->"}</p>
			</Link>
		</div>
	);
};

export default StoreBlock;
