import { useNavigate } from "react-router-dom";
import { useEventStore } from "../../../store/eventStore";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminLightText from "../components/adminLightText/AdminLightText";
import AdminActualEventLink from "./components/adminActualEventLink/AdminActualEventLink";
import "./adminActualEventsPage.css";

const AdminActualEventsPage: React.FC = () => {
	const navigation = useNavigate();
	const { events, isLoading, error } = useEventStore();

	if (isLoading) {
		return (
			<div className="adminActualEventsPageContainer">
				<AdminHeader title="Events" />
				<AdminLightText text="Loading..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminActualEventsPageContainer">
				<AdminHeader title="Events" />
				<AdminLightText text={`Error: ${error}`} />
			</div>
		);
	}

	if (!events) {
		return (
			<div className="adminActualEventsPageContainer">
				<AdminHeader title="Events" />
				<AdminLightText text="No event details available" />
			</div>
		);
	}

	return (
		<div className="adminActualEventsPageContainer">
			<AdminHeader
				title="Events"
				menuItems={[
					{
						label: "Add New Event",
						action: () => navigation("/admin/events/new"),
					},
				]}
			/>

			{events.map((event) => (
				<AdminActualEventLink key={event.id} event={event} />
			))}
		</div>
	);
};

export default AdminActualEventsPage;
