import { CheckIcon } from "lucide-react";
import './PaymentSuccess.css'; // Ensure this is the correct path to your CSS file
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentSuccess = () => {
    const [transactionData, setTransactionData] = useState(null);
    const [flag, setFlag] = useState(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                // Make the API call to get the payment success transaction
                const { data } = await axios.get('http://localhost:4000/api/v1/transaction/get-succeed', {
                    withCredentials: true, // Ensure cookies are sent with the request
                });
                
                setTransactionData(data.transaction);
                setFlag(data.flag);
            } catch (error) {
                console.error("Error fetching transaction data", error);
            }
        };

        fetchTransaction();
    }, []);

    if (!transactionData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="payment-success-container">
            <div className="payment-card">
                <div className="payment-icon">
                    <div className="circle-1"></div>
                    <div className="circle-2"></div>
                    <div className="circle-3"></div>
                    <div className="circle-4">
                        <CheckIcon className="w-12 h-12" style={{ color: 'white' }} />
                    </div>
                </div>

                {/* Conditional title based on the flag */}
                <h1 className="payment-title">
                    {flag === "fresh" ? "Payment Successful" : "Your last payment was successful"}
                </h1>
                <p className="payment-description">
                    Congratulations {transactionData.user.fullname} for becoming a Psycheck {transactionData.plan} user<br />
                </p>

                <div className="payment-details">
                    <div className="item">
                        <span>Extra charges</span>
                        <span>${(transactionData.amount - 28).toFixed(2)}</span>
                    </div>
                    <div className="item">
                        <span>Plan</span>
                        <span>{transactionData.plan}</span>
                    </div>

                    <div className="item">
                        <span>Price</span>
                        <span>${transactionData.amount.toFixed(2)}</span>
                    </div>
                    <div className="item item-total">
                        <span>Total</span>
                        <span>${transactionData.amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
