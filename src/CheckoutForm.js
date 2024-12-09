import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Box, Button, Snackbar, Alert, Typography } from '@mui/material';

const CheckoutForm = ({ items }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setOpen(true);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSuccessMessage('Payment succeeded!');
          setOpen(true);
        }
        console.log('PaymentIntent:', result.paymentIntent);
      }
    } catch (error) {
      setError(error.message);
      setOpen(true);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        color: 'white',
        padding: '20px',
        border: '2px solid black',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginBottom: '20px' }}>
          <CardElement />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!stripe || loading}
          sx={{ backgroundColor: 'white', color: 'black' }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default CheckoutForm;
