import React from "react";
import "./mailing.css";

const Mailing: React.FC = () => {
	return (
		<div className="mailingContainer">
			<p className="mailingText">
				Subscribe to our email newsletter to stay up to date with the latest
				news.
			</p>
			<div className="mailingFormContainer">
				<input
					type="email"
					className="emailInput"
					placeholder="Enter your email"
				/>
				<button className="subscribeButton">Subscribe</button>
			</div>
		</div>
	);
};

export default Mailing;
