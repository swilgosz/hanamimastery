import { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';

export const useCookiesCheck = () => {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    const consent = getCookie('cookieConsent');
    console.log('render');
    setChecked(consent ?? false);
  }, []);

  const handleSetCookie = () => {
    const date = new Date();
    const newDate = new Date(date.setMonth(date.getMonth() + 11));
    setCookie('cookieConsent', 'true', { expires: newDate });
    setChecked(true);
  };

  return [checked, { handleSetCookie }];
};
