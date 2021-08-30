import { useCallback, useState, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpDate, setTokenExpDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expDate) => {
    setToken(token);
    setUserId(uid);
    let tokenExpiryDate;
    if (expDate) {
      tokenExpiryDate = new Date(expDate);
    } else {
      tokenExpiryDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    }
    setTokenExpDate(tokenExpiryDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpiryDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpDate(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  useEffect(() => {
    const localUserData = JSON.parse(localStorage.getItem('userData'));
    if (
      localUserData &&
      localUserData.token &&
      new Date(localUserData.expiration) > new Date()
    ) {
      login(
        localUserData.userId,
        localUserData.token,
        localUserData.expiration
      );
    }
  }, [login]);

  return [userId, token, login, logout];
};
