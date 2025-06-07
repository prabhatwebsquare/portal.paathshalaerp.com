import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function PaymentStatus() {
  const router = useRouter();
  const { orderId } = router.query;

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return; // Wait for orderId to be available

    const fetchPaymentStatus = async () => {
      try {
        // Replace the URL with your actual API endpoint
        // const response = await fetch(`/api/payment-status/${orderId}`);
        // const data = await response.json();

        // if (data && data.status) {
        //   setPaymentStatus(data.status);  // Assuming the API response has "status" indicating success (true) or failure (false)
        // } else {
        //   setPaymentStatus(false);
        // }
        setPaymentStatus(true);
      } catch (err) {
        setError("Error fetching payment status.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error if there's an issue
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        padding: "0 20px",
        background: "linear-gradient(135deg, #f0f4f8, #cfd9e5)",
      }}
    >
      {paymentStatus ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "400px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "scale(1.05)",
              boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <FaCheckCircle
            style={{
              fontSize: "50px",
              marginBottom: "20px",
              color: "#ffffff",
            }}
          />
          <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
            Payment Successful
          </h1>
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            Your payment for Order ID: {orderId} was successful.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "400px",
            backgroundColor: "#F44336",
            color: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "scale(1.05)",
              boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <FaTimesCircle
            style={{ fontSize: "50px", marginBottom: "20px", color: "#ffffff" }}
          />
          <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
            Payment Failed
          </h1>
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            Unfortunately, your payment for Order ID: {orderId} was not
            successful. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentStatus;
