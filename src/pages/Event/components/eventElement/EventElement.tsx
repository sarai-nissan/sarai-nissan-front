import Button from "../../../../components/button/Button";
import { addToGoogleCalendar, formatDateToMonthName } from "../../../../utils";
import type { EventType } from "../../../../types/Event";
import "./eventElement.css";

const EventElement: React.FC<EventType> = (props) => {
	const {
		eventName,
		date,
		day,
		time,
		city,
		venueName,
		additionalInfo,
		purchaseTicketsLink,
		buttonText,
	} = props;

	return (
		<div className="eventElementContainer">
			<div className="eventElementDateHeader">
				<p className="eventElementDate">
					{formatDateToMonthName(date)?.month.slice(0, 3)}
				</p>
				<p className="eventElementDate">{formatDateToMonthName(date)?.day}</p>
			</div>

			<div>
				<p className="eventElementEventName">
					{eventName} - {city}
				</p>

				<p className="eventElementText">
					{day}, {formatDateToMonthName(date)?.month}{" "}
					{formatDateToMonthName(date)?.day},{" "}
					{formatDateToMonthName(date)?.year}
				</p>
				<p className="eventElementText eventElementGap">{time}</p>
				{venueName && (
					<p className="eventElementText eventElementGap">{venueName}</p>
				)}

				{additionalInfo && (
					<p className="eventElementAdditionalInfo eventElementGap">
						{additionalInfo}
					</p>
				)}

				<div className="eventElementButtonContainer">
					{eventName && date && time && (
						<p
							className="eventElementCalendarButton"
							onClick={() =>
								addToGoogleCalendar({
									eventName,
									additionalInfo,
									city,
									venueName,
									date,
									time,
								})
							}
						>
							Add to Google Calendar
						</p>
					)}

					{purchaseTicketsLink && buttonText && (
						<a
							href={purchaseTicketsLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button text={buttonText} />
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

export default EventElement;
