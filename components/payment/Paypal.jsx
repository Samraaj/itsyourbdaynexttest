import React, { Component } from "react";

import { PayPalButton } from "react-paypal-button-v2";

const Paypal = () => {
	const onSuccess = (details, data) => {
		console.log(
			"Transaction completed by " + details.payer.name.given_name
		);
	};

	return (
		<PayPalButton
			amount="0.01"
			shippingPreference="NO_SHIPPING"
			onSuccess={onSuccess}
			options={{
				clientId:
					"AYvF1mMGIJrR7jP-sFzEQnxwSuj76NHYuk4_yFmAU5_k9JtqTnTEywr3LBsWsgj4hF1xh6nppePNouPa",
				disableFunding: "credit",
			}}
		/>
	);
};

export default Paypal;
