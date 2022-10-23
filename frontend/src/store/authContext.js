import { createContext, useCallback, useEffect, useState } from 'react';

const AuthContext = createContext({
   token: '',
   login: (token, expirationTime) => {},
   logout: () => {},
});

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
   const currentTime = new Date().getTime();
   const adjustedExpirationTime = new Date(expirationTime).getTime();
   const remainingDuration = adjustedExpirationTime - currentTime;
   return remainingDuration;
};

const retrieveStoredToken = () => {
   const storedToken = localStorage.getItem('token');
   const storedExpirationDate = localStorage.getItem('expirationTime');

   const remainingTime = calculateRemainingTime(storedExpirationDate);

   if (remainingTime <= 6000) {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      return null;
   }

   return {
      token: storedToken,
      duration: remainingTime,
   };
};

export const AuthContextProvider = (props) => {
   const tokenData = retrieveStoredToken();
   let initialToken;
   if (tokenData) {
      initialToken = tokenData.token;
   }

   const [token, setToken] = useState(initialToken);

   const logoutHandler = useCallback(() => {
      setToken(null);
      localStorage.removeItem('token');

      if (logoutTimer) {
         clearTimeout(logoutTimer);
      }
   }, []);

   const loginHandler = (token, expirationTime) => {
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('expirationTime', expirationTime);

      const remainingTime = calculateRemainingTime(expirationTime);
      logoutTimer = setTimeout(logoutHandler, remainingTime);
   };

   useEffect(() => {
      if (tokenData) {
         logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
   }, [tokenData, logoutHandler]);

   const contextValue = {
      token: token,
      login: loginHandler,
      logout: logoutHandler,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {props.children}
      </AuthContext.Provider>
   );
};

export default AuthContext;
