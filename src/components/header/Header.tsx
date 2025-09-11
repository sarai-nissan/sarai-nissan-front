import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";
import Inst from "../../assets/icons/Inst";
import Tiktok from "../../assets/icons/Tiktok";

import "./header.css";

const Header: React.FC = () => {
	const location = useLocation();

	const getLinkClassName = (path: string) => {
		return location.pathname === path ? "navLink active" : "navLink";
	};

	return (
		<div className="headerContainer">
			<img src={logoImg} alt="Logo" className="headerLogo" />
			<div className="headerNavLinksContainer">
				<Link to="/" className={getLinkClassName("/")}>
					Home
				</Link>
				<Link to="/shop" className={getLinkClassName("/shop")}>
					Shop
				</Link>
				<Link to="/cart" className={getLinkClassName("/cart")}>
					Cart
				</Link>
				<div className="headerSocialLinksContainer">
					<Link
						to="https://www.instagram.com/sarainissan/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Inst className="headerSocialIcons" />
					</Link>
					<Link to="/" target="_blank" rel="noopener noreferrer">
						<Tiktok className="headerSocialIcons" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Header;
