import EventElement from "./components/eventElement/EventElement";
import { useEventStore } from "../../store/useEventStore";
import "./eventPage.css";

const EventPage: React.FC = () => {
	const { events } = useEventStore();

	return (
		<div className="eventPageContainer">
			{events.map((event) => (
				<EventElement
					key={event.id}
					date={event.date}
					day={event.day}
					time={event.time}
					eventName={event.eventName}
					city={event.city}
					venueName={event.venueName}
					purchaseTicketsLink={event.purchaseTicketsLink}
					additionalInfo={event.additionalInfo}
					buttonText={event.buttonText}
				/>
			))}
		</div>
	);
};

export default EventPage;
