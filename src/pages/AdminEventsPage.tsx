import AdminHeader from "../components/adminHeader/AdminHeader";
import { useEventStore } from "../store/eventStore";
import "../styles/adminEventsPage.css";

const LineText: React.FC<{ label: string; value?: string }> = ({
	label,
	value = "",
}) => (
	<div className="adminEventLineTextContainer">
		<p className="adminEventsLightText">{label}:</p>
		<p className="adminEventsRegularText">{value}</p>
	</div>
);

const AdminEventsPage: React.FC = () => {
	const { events, isLoading, error } = useEventStore();

	if (isLoading) {
		return (
			<div className="adminEventsPageContainer">
				<AdminHeader title="Events" />
				<p className="adminEventsLightText">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminEventsPageContainer">
				<AdminHeader title="Events" />
				<p className="adminEventsLightText">Error: {error}</p>
			</div>
		);
	}

	if (!events) {
		return (
			<div className="adminEventsPageContainer">
				<AdminHeader title="Events" />
				<p className="adminEventsLightText">No order details available</p>
			</div>
		);
	}

	return (
		<div className="adminEventsPageContainer">
			<AdminHeader
				title="Events"
				menuItems={[
					{
						label: "Add New Event",
						action: () => {
							console.log("Add New Event clicked");
						},
					},
				]}
			/>

			{events.map((event) => (
				<div key={event.id} className="test1">
					<LineText label="Date" value={event.date} />
					<LineText label="Day" value={event.day} />
					<LineText label="Time" value={event.time} />
					<LineText label="Event Name" value={event.eventName} />
					<LineText label="City" value={event.city} />
					{event.venueName && (
						<LineText label="Venue Name" value={event.venueName} />
					)}
					{event.additionalInfo && (
						<LineText label="Additional Info" value={event.additionalInfo} />
					)}
					{event.purchaseTicketsLink && (
						<LineText
							label="Purchase Tickets Link"
							value={event.purchaseTicketsLink}
						/>
					)}
					{event.buttonText && (
						<LineText label="Button Text" value={event.buttonText} />
					)}
				</div>
			))}
		</div>
	);
};

export default AdminEventsPage;
