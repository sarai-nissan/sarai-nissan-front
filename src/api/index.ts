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

// export const sendInvoiceEmail = async (
// 	email: string,
// 	invoiceNumber: string
// ) => {
// 	try {
// 		const response = await fetch("https://api.omnisend.com/v3/emails", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"X-API-KEY": import.meta.env.VITE_OMNISEND_API_KEY,
// 			},
// 			body: JSON.stringify({
// 				from: {
// 					email: "sarainissanhelp@gmail.com",
// 					name: "Sarai Nissan Shop",
// 				},
// 				to: [{ email }],
// 				subject: "Your order has been shipped!",
// 				htmlContent: `<p>Thank you for your order!</p><p>Your tracking number: <b>${invoiceNumber}</b></p>`,
// 				textContent: `Thank you for your order! Your tracking number: ${invoiceNumber}`,
// 			}),
// 		});

// 		if (!response.ok) {
// 			const errorText = await response.text();
// 			console.error("❌ Omnisend error:", response.status, errorText);
// 			ctx.status = 500;
// 			ctx.body = { error: "Omnisend request failed", details: errorText };
// 			return;
// 		}

// 		console.log("Invoice email sent successfully");
// 	} catch (err) {
// 		console.error("Error sending invoice email:", err);
// 		throw err;
// 	}
// };
