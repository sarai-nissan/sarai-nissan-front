import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sendEmail } from "../../../../api";
import { validateEmail } from "../../../../utils";
import "./homeEmail.css";

const HomeEmail: React.FC = () => {
	const [email, setEmail] = useState("");
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		if (validateEmail(email)) {
			setIsValidEmail(true);
		} else {
			setIsValidEmail(false);
		}
	}, [email]);

	useEffect(() => {
		if (isSubmitted) {
			const timer = setTimeout(() => {
				setIsSubmitted(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isSubmitted]);

	const handleSubmit = async () => {
		sendEmail(email);
		setEmail("");
		setIsSubmitted(true);
	};

	return (
		<div className="homeEmailContainer">
			<div className="homeEmailSubscribeContainer">
				<p className="homeEmailSubscribeText">
					Subscribe to our email newsletter to stay up to date with the latest
					news.
				</p>

				<div>
					{!isSubmitted ? (
						<div className="homeEmailSubscribeFormInnerContainer">
							<input
								type="text"
								placeholder="Enter your email"
								className="homeEmailSubscribeInput"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<button
								className="homeEmailSubscribeButton"
								disabled={!isValidEmail}
								onClick={handleSubmit}
							>
								Subscribe
							</button>
						</div>
					) : (
						<p className="homeEmailSubmittedText">
							Thank you for subscribing to our newsletter!
						</p>
					)}
				</div>
			</div>

			<Link to="/shop">
				<p className="homeEmailShopLink">Go to shop</p>
			</Link>
		</div>
	);
};

export default HomeEmail;
