import "../styles/contactPage.css";

const ContactPage: React.FC = () => {
	return (
		<div className="contactPageContainer">
			<p className="contactPageMainText">Contacts</p>

			<p className="contactPageRegularText">
				for all questions Please email:{" "}
				<a href="mailto:sarainissan@gmail.com" className="contactPageLinkText ">
					sarainissan@gmail.com
				</a>
			</p>

			<a
				href="https://www.instagram.com/sarainissan"
				target="_blank"
				rel="noopener noreferrer"
				className="contactPageLinkText contactPageRegularText"
			>
				@sarainissan
			</a>

			<p className="contactPageRegularText">OR</p>

			<p className="contactPageRegularText">
				PURCHASE SELECT PRODUCTS VIA{" "}
				<a
					href="https://www.faire.com/direct/sarainissan "
					target="_blank"
					rel="noopener noreferrer"
					className="contactPageLinkText"
				>
					FAIRE
				</a>
			</p>
		</div>
	);
};

export default ContactPage;
