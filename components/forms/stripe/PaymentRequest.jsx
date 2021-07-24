import React, { useState, useEffect } from "react";

import {
	PaymentRequestButtonElement,
	useStripe,
} from "@stripe/react-stripe-js";

import Checkout from "./Checkout";

const PaymentRequest = ({ amount }) => {
	const stripe = useStripe();
	const [paymentRequest, setPaymentRequest] = useState(null);
	const [clientSecret, setClientSecret] = useState("");

	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: "US",
				currency: "usd",
				total: {
					label: "Bottle",
					amount: amount * 500,
				},
				requestPayerName: false,
				requestPayerEmail: false,
			});

			// Check the availability of the Payment Request API.
			pr.canMakePayment().then((result) => {
				if (result) {
					setPaymentRequest(pr);

					// Configure on success
					pr.on("paymentmethod", async (ev) => {
						// Confirm the PaymentIntent without handling potential next actions (yet).
						const {
							paymentIntent,
							error: confirmError,
						} = await stripe.confirmCardPayment(
							clientSecret,
							{ payment_method: ev.paymentMethod.id },
							{ handleActions: false }
						);

						if (confirmError) {
							// Report to the browser that the payment failed, prompting it to
							// re-show the payment interface, or show an error message and close
							// the payment interface.
							ev.complete("fail");
						} else {
							// Report to the browser that the confirmation was successful, prompting
							// it to close the browser payment method collection interface.
							ev.complete("success");
							// Check if the PaymentIntent requires any actions and if so let Stripe.js
							// handle the flow. If using an API version older than "2019-02-11" instead
							// instead check for: `paymentIntent.status === "requires_source_action"`.
							if (paymentIntent.status === "requires_action") {
								// Let Stripe.js handle the rest of the payment flow.
								const {
									error,
								} = await stripe.confirmCardPayment(
									clientSecret
								);
								if (error) {
									// The payment failed -- ask your customer for a new payment method.
								} else {
									// The payment has succeeded.
								}
							} else {
								// The payment has succeeded.
							}
						}
					});
				}
			});
		}
	}, [stripe]);

	// Create a new PaymentIntent on pageload and when the amount changes
	useEffect(() => {
		retrieveClientSecret();
	}, [amount]);

	const retrieveClientSecret = () => {
		window
			.fetch("/api/wishes/createPaymentIntent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ items: [{ amount: amount }] }),
			})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				setClientSecret(data.clientSecret);
			});
	};

	const onPaymentSuccessful = () => {
		console.log("success!");
	};

	const options = {
		paymentRequest,
		style: {
			paymentRequestButton: {
				type: "buy",
				// One of 'default', 'book', 'buy', or 'donate'
				// Defaults to 'default'

				theme: "dark",
				// One of 'dark', 'light', or 'light-outline'
				// Defaults to 'dark'

				height: "40px",
				// Defaults to '40px'. The width is always '100%'.
			},
		},
	};

	if (paymentRequest) {
		return <PaymentRequestButtonElement options={options} />;
	}

	return <Checkout amount={5} onPaymentSuccessful={onPaymentSuccessful} />;
};

export default PaymentRequest;
