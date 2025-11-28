import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../../../store/useEventStore";
import { createEvent, deleteEventById, updateEventById } from "../../../api";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminInput from "../components/adminInput/AdminInput";
import ButtonAdmin from "../components/buttonAdmin/ButtonAdmin";
import "./adminEvent.css";

const AdminEvent: React.FC = () => {
	const { id: documentId } = useParams();
	const navigation = useNavigate();
	const { fetchEvents, events } = useEventStore();
	const isNew = window.location.pathname.endsWith("/new");
	const event = events.find((e) => e.documentId === documentId);
	const [message, setMessage] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const [eventForm, setEventForm] = useState({
		date: event?.date || "",
		day: event?.day || "",
		time: event?.time || "",
		eventName: event?.eventName || "",
		city: event?.city || "",
		venueName: event?.venueName || "",
		additionalInfo: event?.additionalInfo || "",
		purchaseTicketsLink: event?.purchaseTicketsLink || "",
		buttonText: event?.buttonText || "",
	});

	useEffect(() => {
		if (!event && !isNew) fetchEvents(true);
	}, []);

	const saveChangesHandler = async () => {
		setMessage(null);
		try {
			if (isNew) {
				await createEvent(eventForm);
				setMessage("✅ Event created successfully!");
			} else if (documentId) {
				await updateEventById(documentId, eventForm);
				setMessage("✅ Changes saved successfully!");
			}
			await fetchEvents(true);
		} catch (err) {
			console.error(err);
			setMessage("❌ Failed to save changes. Try again.");
		}
	};

	const deleteEventHandler = async () => {
		if (!documentId) return;
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this event? This action cannot be undone."
		);
		if (!confirmDelete) return;

		try {
			setIsDeleting(true);
			await deleteEventById(documentId);
			setMessage("🗑️ Event deleted successfully!");
			await fetchEvents(true);
			setTimeout(() => navigation("/admin/events"), 1000);
		} catch (err) {
			console.error(err);
			setMessage("❌ Failed to delete event.");
		} finally {
			setIsDeleting(false);
		}
	};

	if (!isNew && !event && documentId !== "new")
		return (
			<div className="adminEventContainer">
				<AdminHeader title="Event Details" />
				<p>Loading...</p>
			</div>
		);

	return (
		<div className="adminEventContainer">
			<AdminHeader
				title={isNew ? "Create New Event" : "Event Details"}
				menuItems={
					!isNew
						? [
								{
									label: isDeleting ? "Deleting..." : "Delete Event",
									action: deleteEventHandler,
								},
						  ]
						: undefined
				}
			/>

			<div className="adminEventInner">
				<AdminInput
					label="Date* (m-d-yyyy, 1-1-2025)"
					value={eventForm.date}
					onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
				/>
				<AdminInput
					label="Day* (Monday, monday, MONDAY)"
					value={eventForm.day}
					onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
				/>
				<AdminInput
					label="Time* (12:00 PM - 3:30 PM)"
					value={eventForm.time}
					onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
				/>
				<AdminInput
					label={`Event Name*`}
					value={eventForm.eventName}
					onChange={(e) =>
						setEventForm({ ...eventForm, eventName: e.target.value })
					}
				/>
				<AdminInput
					label={`City* (CITY, City, city)`}
					value={eventForm.city}
					onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
				/>
				<AdminInput
					label="Venue Name"
					value={eventForm.venueName}
					onChange={(e) =>
						setEventForm({ ...eventForm, venueName: e.target.value })
					}
				/>
				<AdminInput
					label="Additional Info"
					value={eventForm.additionalInfo}
					onChange={(e) =>
						setEventForm({ ...eventForm, additionalInfo: e.target.value })
					}
				/>
				<AdminInput
					label="Purchase Tickets Link"
					value={eventForm.purchaseTicketsLink}
					onChange={(e) =>
						setEventForm({ ...eventForm, purchaseTicketsLink: e.target.value })
					}
				/>
				<AdminInput
					label="Button Text"
					value={eventForm.buttonText}
					onChange={(e) =>
						setEventForm({ ...eventForm, buttonText: e.target.value })
					}
				/>

				<ButtonAdmin
					text={isNew ? "Create" : "Save"}
					onClick={saveChangesHandler}
					styles={styles.button}
				/>

				{message && (
					<p
						style={{
							color: message.startsWith("✅") ? "green" : "red",
							marginTop: "0.5rem",
						}}
					>
						{message}
					</p>
				)}

				<div>
					<p className="adminEventRequirementsText">
						1. To have a link to add to the calendar, you must have:
					</p>
					<div className="adminEventRequirementsContainer">
						<div className="adminEventRequirementsInner">
							<p className="adminEventRequirementsText">Minimum:</p>
							<ul className="adminEventRequirementsUl">
								<li className="adminEventRequirementsText">Event Name</li>
								<li className="adminEventRequirementsText">Date</li>
								<li className="adminEventRequirementsText">Time</li>
							</ul>
						</div>
						<div className="adminEventRequirementsInner">
							<p className="adminEventRequirementsText">For full info:</p>
							<ul className="adminEventRequirementsUl">
								<li className="adminEventRequirementsText">Additional Info</li>
								<li className="adminEventRequirementsText">Venue Name</li>
								<li className="adminEventRequirementsText">City</li>
							</ul>
						</div>
					</div>
				</div>

				<div>
					<p className="adminEventRequirementsText">
						2. To have a button to purchase tickets, you must have:
					</p>
					<div className="adminEventRequirementsContainer">
						<ul className="adminEventRequirementsUl">
							<li className="adminEventRequirementsText">
								Purchase Tickets Link
							</li>
							<li className="adminEventRequirementsText">Button Text</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminEvent;

const styles: { [key: string]: CSSProperties } = {
	button: {
		marginTop: "1rem",
		marginBottom: "2rem",
		borderRadius: "50px",
		width: "140px",
	},
};
