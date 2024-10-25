'use client';

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else if (data.error) {
                setErrorMessage(data.error);
            }
        })
        .catch((error) => {
            console.error("Error fetching client secret:", error);
            setErrorMessage("An error occurred while processing the payment.");
        });
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setErrorMessage("Stripe has not loaded yet.");
            setLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `http://localhost:3000/payment-success?amount=${amount}`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            console.log('Payment successful');
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">HelloDoctor</h1>
                <h2 className="text-lg text-gray-700 text-center mb-4">
                    has requested <span className="font-semibold">${amount.toFixed(2)}</span>
                </h2>
                {clientSecret ? (
                    <form onSubmit={handleSubmit}>
                        <PaymentElement className="mb-4" />
                        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-300"
                        >
                            {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
                        </button>
                    </form>
                ) : errorMessage ? (
                    <div className="text-red-500 text-center">{errorMessage}</div>
                ) : (
                    <p className="text-center text-gray-500">Loading payment information...</p>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;