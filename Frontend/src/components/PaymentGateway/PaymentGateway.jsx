import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const PaymentGateway = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/create-payment-intent', { amount, currency: 'usd' });
      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      setLoading(false);

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
      }
    } catch (err) {
      setLoading(false);
      setError('Payment failed, please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>Pay Now</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {paymentSuccess && <div style={{ color: 'green' }}>Payment successful!</div>}
    </form>
  );
};

// PaymentWrapper that wraps the PaymentGateway component with the Elements provider
const PaymentWrapper = ({ amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentGateway amount={amount} />
    </Elements>
  );
};

export default PaymentWrapper;
