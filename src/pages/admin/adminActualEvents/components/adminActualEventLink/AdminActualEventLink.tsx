import { useNavigate } from "react-router-dom";
import AdminActualEventLine from "../adminActualEventLine/AdminActualEventLine";
import type { EventType } from "../../../../../types/Event";
import "./adminActualEventLink.css";

type Props = {
	event: EventType;
};

const AdminActualEventLink: React.FC<Props> = ({ event }) => {
	const { date, day, time, eventName, city } = event;
	const navigation = useNavigate();

	const navigateToEventDetails = () => {
		if (event.documentId) {
			navigation(`/admin/events/${event.documentId}`);
		} else {
			console.error("❌ Event missing documentId:", event);
		}
	};
	return (
		<div className="adminEventLinkContainer" onClick={navigateToEventDetails}>
			<AdminActualEventLine label={date} />
			<AdminActualEventLine label={time} value={day} />
			<AdminActualEventLine label={city} value={eventName} />
		</div>
	);
};

export default AdminActualEventLink;
