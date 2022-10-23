import React from 'react';
import './Auth.css';
import logo from '../assets/logo.svg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useInput from '../hooks/use-input';
import { useContext } from 'react';
import AuthContext from '../store/authContext';
import { useState } from 'react';

export default function Auth() {
   const [searchparams] = useSearchParams();
   const isSignUp = searchparams.get('signup');
   const [error, setError] = useState();
   // const { sendRequest, status, data, error } = useHttp(
   //    isSignUp ? signup : login,
   //    false
   // );

   const authContext = useContext(AuthContext);
   const navigate = useNavigate();

   const validateEmail = (email) => {
      const validRegex =
         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (email.match(validRegex)) {
         return true;
      } else return false;
   };

   const {
      value: emailValue,
      isValid: emailIsValid,
      hasError: emailHasError,
      valueChangeHandler: emailChangeHandler,
      inputBlurHandler: emailBlurHandler,
   } = useInput(validateEmail);

   const {
      value: passwordValue,
      isValid: passwordIsValid,
      hasError: passwordHasError,
      valueChangeHandler: passwordChangeHandler,
      inputBlurHandler: passwordBlurHandler,
   } = useInput((value) => value.trim().length > 5);

   const {
      value: confirmPasswordValue,
      isValid: confirmPasswordIsValid,
      hasError: confirmPasswordHasError,
      valueChangeHandler: confirmPasswordChangeHandler,
      inputBlurHandler: confirmPasswordBlurHandler,
   } = useInput((value) => value.trim() === passwordValue.trim());

   const submitHandler = async (e) => {
      e.preventDefault();
      const authData = { email: emailValue, password: passwordValue };
      let url;
      let method;
      if (isSignUp) {
         url = 'http://192.168.43.166:5000/auth/signup';
         method = 'PUT';
      } else {
         url = 'http://192.168.43.166:5000/auth/login';
         method = 'POST';
      }
      const response = await fetch(url, {
         method,
         body: JSON.stringify(authData),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const data = await response.json();
      if (!response.ok) {
         isSignUp ? setError(data.data[0].msg) : setError(data.message);
      } else {
         authContext.login(data.token, data.expiresIn);
         navigate('/');
      }
   };

   let formIsValid;
   if (isSignUp) {
      formIsValid = emailIsValid && passwordIsValid && confirmPasswordIsValid;
   } else {
      formIsValid = emailIsValid && passwordIsValid;
   }

   const emailInputClass = emailHasError
      ? 'form-control invalid'
      : 'form-control';
   const passwordInputClass = passwordHasError
      ? 'form-control invalid'
      : 'form-control';
   const confirmPasswordInputClass = confirmPasswordHasError
      ? 'form-control invalid'
      : 'form-control';

   return (
      <div className="auth-page">
         <div className="logo">
            <img src={logo} alt="logo" />
         </div>
         <div className="auth-card">
            <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
            <form onSubmit={submitHandler}>
               <div className={emailInputClass}>
                  <input
                     type="email"
                     name="email"
                     placeholder="Email adress"
                     value={emailValue}
                     onChange={emailChangeHandler}
                     onBlur={emailBlurHandler}
                  />
                  {emailHasError && <p>invalid email</p>}
               </div>
               <div className={passwordInputClass}>
                  <input
                     type="password"
                     name="password"
                     placeholder="Password"
                     value={passwordValue}
                     onChange={passwordChangeHandler}
                     onBlur={passwordBlurHandler}
                  />
                  {passwordHasError && <p>min of 6 characters</p>}
               </div>
               {isSignUp && (
                  <div className={confirmPasswordInputClass}>
                     <input
                        type="password"
                        placeholder="Repeat password"
                        name="confirmPassword"
                        value={confirmPasswordValue}
                        onChange={confirmPasswordChangeHandler}
                        onBlur={confirmPasswordBlurHandler}
                     />
                     {confirmPasswordHasError && <p>passwords must match</p>}
                  </div>
               )}
               {error && <p className="server-error">{error}</p>}
               <div>
                  <button disabled={!formIsValid}>
                     {isSignUp ? 'Create an account' : 'Login to your account'}
                  </button>
               </div>
               {!isSignUp ? (
                  <div className="toggle-login">
                     <p>
                        Don't have an account?
                        <Link to="/auth?signup=true">Sign Up</Link>
                     </p>
                  </div>
               ) : (
                  <div className="toggle-login">
                     <p>
                        Already have an account?
                        <Link to="/auth">Login</Link>
                     </p>
                  </div>
               )}
            </form>
         </div>
      </div>
   );
}
