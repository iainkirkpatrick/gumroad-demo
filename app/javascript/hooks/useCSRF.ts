import { useState, useEffect } from 'react'

export function useCSRF () {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // N.B. would want to handle if csrf-token meta tag is missing
    const token = document.querySelector('meta[name="csrf-token"]')!.getAttribute('content');
    setCsrfToken(token);
  }, []);

  return [csrfToken, setCsrfToken]
}