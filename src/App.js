import React, { useState, useEffect } from 'react';
import LoadingPage from './loading';  // Adjust path as necessary
import App from './shop';  // Your main app component

const MainApp = () => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setLoading(false);
      }, 2000);  // Match this duration with the CSS transition duration
    }, 2000);  // Adjust loading duration as needed
  }, []);

  return (
    <div>
      {loading ? <LoadingPage visible={visible} /> : <App />}
    </div>
  );
};

export default MainApp;
