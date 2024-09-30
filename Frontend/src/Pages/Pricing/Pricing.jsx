import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import "./Pricing.css";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription plans from the backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/subscription/get-all');
        if (response.data.success) {
          setPlans(response.data.data);
        } else {
          setError('Failed to load plans');
        }
      } catch (error) {
        setError('An error occurred while fetching plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle subscription initiation when "Subscribe" is clicked
  const handleSubscribe = async (planId) => {
    try {
      // Making a request to initiate the Stripe checkout session
      const response = await axios.post(
        `http://localhost:4000/api/v1/subscription/checkout-session/${planId}`,
        {},
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      if (response.data.success) {
        // Redirect to the Stripe checkout page
        window.location.href = response.data.session.url;
      } else {
        alert('Failed to initiate checkout session');
      }
    } catch (error) {
      console.error('Error initiating checkout session:', error);
      alert('An error occurred while initiating the checkout session');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pricing-container">
      <h1>Pricing</h1>
      <div className="pricing-cards">
        {plans.map((plan) => (
          <div key={plan._id} className="pricing-card">
            <div className="pricing-recommended-badge">{plan.badge}</div>
            <h2>{plan.name}</h2>
            <p className="pricing-price">
              <span className="pricing-dollar">${plan.amount}</span>
              <span className="pricing-per-month">/month</span>
            </p>
            <p className="pricing-description">{plan.description}</p>
            <ul className="pricing-features">
              {(plan.features.length > 0 ? plan.features : plan.featurs).map((feature, index) => (
                <li key={index}>
                  <FaCheckCircle style={{ color: 'var(--primary-color)', marginRight: '8px' }} />
                  {feature}
                </li>
              ))}
            </ul>
            {/* Conditional Button Texts */}
            {plan._type === "starter" ? (
              <>
                <button className="pricing-btn pricing-primary" onClick={() => handleSubscribe(plan._id)}>Get started</button>
                <button className="pricing-btn pricing-secondary">Sign up</button>
              </>
            ) : plan._type === "plus" ? (
              <>
                <button className="pricing-btn pricing-primary" onClick={() => handleSubscribe(plan._id)}>Subscribe</button>
                <button className="pricing-btn pricing-secondary">Sign up</button>
              </>
            ) : (
              <>
                <button className="pricing-btn pricing-primary" onClick={() => handleSubscribe(plan._id)}>Subscribe</button>
                <button className="pricing-btn pricing-secondary">Sign up as an expert</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
