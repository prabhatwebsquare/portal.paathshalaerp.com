'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const AtomPaynetz = forwardRef((_, ref) => {
  const [token, setToken] = useState('');
  const [txnId, setTxnId] = useState('');
  const [merchId, setMerchId] = useState('');

  useImperativeHandle(ref, () => ({
    openPay,
  }));

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setToken(data.token || '');
      setTxnId(data.txnId || '');
      setMerchId(data.merchId || '');
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://pgtest.atomtech.in/staticdata/ots/js/atomcheckout.js?v=${Date.now()}`;
    script.id = 'atom-script';

    const handleMessage = ({ data }) => {
      if (data === 'cancelTransaction') console.log('Payment cancelled.');
      else if (data === 'sessionTimeout') console.log('Session timeout.');
      else if (data.ndpsResponse) console.log('ndpsResponse:', data.ndpsResponse);
    };

    script.onload = () => {
      window.addEventListener('message', handleMessage);
    };

    document.head.appendChild(script);

    return () => {
      window.removeEventListener('message', handleMessage);
      const existingScript = document.getElementById('atom-script');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const openPay = ({ custEmail, custMobile, amount }) => {
    console.log(custEmail,custMobile,amount)
    const options = {
      atomTokenId: token,
      merchId,
      custEmail,
      custMobile,
      amount,
      returnUrl: 'http://localhost:3000/api/response',
    };

    if (typeof window.AtomPaynetz === 'function') {
      new window.AtomPaynetz(options, 'uat');
    } else {
      console.error('AtomPaynetz not loaded.');
    }
  };

  return null;
});

export default AtomPaynetz;
