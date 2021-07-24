import React, { useState, useEffect } from "react";
import {
	PaymentRequestButtonElement,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";

const Checkout = ({ amount, onPaymentSuccessful }) => {
	// Stripe state
	const [succeeded, setSucceeded] = useState(false);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState("");
	const [paymentRequest, setPaymentRequest] = useState(null);
	const [cardPayment, setCardPayment] = useState(false);

	// Stripe hooks
	const stripe = useStripe();
	const elements = useElements();

	// Create a new PaymentIntent on pageload and when the amount changes
	useEffect(() => {
		retrieveClientSecret();
	}, [amount]);

	// Update the amount on the payment request
	useEffect(() => {
		if (paymentRequest && amount) {
			paymentRequest.update({
				total: {
					label: "Bottle",
					amount: amount * 500,
				},
			});
		}
	}, [amount, paymentRequest]);

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
	useEffect(() => {
		if (stripe && clientSecret) {
			const pr = stripe.paymentRequest({
				country: "US",
				currency: "usd",
				total: {
					label: "Mug",
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
							console.log("confirm error fail");
							console.log(confirmError);
							setError(confirmError.message);
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
									console.log("COnfirmCardPayment failure");
									console.log(error);
									setError(error.message);
								} else {
									// The payment has succeeded.
									setError(null);
									setProcessing(false);
									setSucceeded(true);
									onPaymentSuccessful();
								}
							} else {
								// The payment has succeeded.
								setError(null);
								setProcessing(false);
								setSucceeded(true);
								onPaymentSuccessful();
							}
						}
					});
				} else {
					setCardPayment(true);
				}
			});
		}
	}, [stripe, clientSecret]);

	// Style for the card input
	const cardStyle = {
		style: {
			base: {
				color: "#32325d",
				fontFamily: "Roboto, sans-serif",
				fontSmoothing: "antialiased",
				fontSize: "16px",
				"::placeholder": {
					color: "#32325d",
				},
			},
			invalid: {
				color: "#fa755a",
				iconColor: "#fa755a",
			},
		},
	};

	const handleChange = async (event) => {
		// Listen for changes in the CardElement
		// and display any errors as the customer types their card details
		setDisabled(event.empty);
		setError(event.error ? event.error.message : "");
	};

	// Handles the card element submitting
	const handleSubmit = async (ev) => {
		ev.preventDefault();
		setProcessing(true);
		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
		});
		if (payload.error) {
			setError(`Payment failed ${payload.error.message}`);
			setProcessing(false);
		} else {
			setError(null);
			setProcessing(false);
			setSucceeded(true);
			onPaymentSuccessful();
		}
	};

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			{!succeeded && (
				<React.Fragment>
					{paymentRequest && (
						<PaymentRequestButtonElement
							options={{ paymentRequest }}
						/>
					)}
					{cardPayment && (
						<React.Fragment>
							<CardElement
								id="card-element"
								options={cardStyle}
								onChange={handleChange}
							/>
							<button
								disabled={processing || disabled || succeeded}
								id="submit"
								className="checkoutbutton"
							>
								<span id="button-text">
									{processing ? (
										<div
											className="spinner"
											id="spinner"
										></div>
									) : (
										"Pay"
									)}
								</span>
							</button>
						</React.Fragment>
					)}

					{error && (
						<div className="card-error" role="alert">
							{error}
						</div>
					)}
				</React.Fragment>
			)}
			<p
				className={
					succeeded ? "result-message" : "result-message hidden"
				}
			>
				Payment succeeded! This gift will be cherished!
			</p>
		</form>
	);
};

export default Checkout;
