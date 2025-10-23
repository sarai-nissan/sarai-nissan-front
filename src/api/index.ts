export const sendEmail = async (email: string) => {
	try {
		await fetch("https://api.omnisend.com/v3/contacts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": import.meta.env.VITE_OMNISEND_API_KEY,
			},
			body: JSON.stringify({
				identifiers: [
					{
						type: "email",
						id: email,
						channels: {
							email: {
								status: "subscribed",
							},
						},
					},
				],
			}),
		});
	} catch (error) {
		console.error("Error sending email:", error);
	}
};
