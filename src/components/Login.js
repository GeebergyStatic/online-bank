// import useRef and useContext
import { useRef, useContext, useEffect, useState } from "react";
// import Context to get shared data from React context.
import Context from "../Context";
// import firebase authentication and real time database.
import { auth, db, realTimeDb } from "../firebase";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {ref, onValue, orderByChild, equalTo, query, orderByValue, child} from 'firebase/database';
// import validator to validate user's credentials.
import validator from "validator";
// import custom componnets.
import withModal from "./Modal";
import SignUp from "./SignUp";
// import history
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from './Loading';
import ForgotPasswordModal from "./ForgotPasswordModal";

function Login(props) {
  // get shared data from context.
  const [isLoading, setIsLoading] = useState(false);
  // get toggle modal function from withModal - higher order component.
  const { toggleModal } = props;
  // create ref to get user's email and user's password.
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');


  const history = useNavigate();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * validate user's credentials.
   * @param {*} email 
   * @param {*} password 
   * @returns 
   */
  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  /**
   * login
   */
  const login = () => {
    // show loading indicator.
    setIsLoading(true);
    // get the user's creadentials.
    const cleanedEmail = emailRef.current.value;
    const email = cleanedEmail.trim();
    const cleanedPassword = passwordRef.current.value;
    const password = cleanedPassword.trim();
    if (isUserCredentialsValid(email, password)) {
      // if the user's credentials are valid, call Firebase authentication service.
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {


        const userEmail = userCredential.user.email;
        const userID = userCredential.user.uid;
        const dbRef = ref(realTimeDb, `users/${userID}`);
        const ID = auth.currentUser.uid;
                localStorage.setItem('auth', JSON.stringify(ID));
                // save authenticated user to context.
                // hide loading.
                setIsLoading(false);
                // redirect to home page.
                history('/');
                window.location.reload(); // This refreshes the page
            
      

          // end of then promise
        })
        .catch((error) => {      
          // hide loading indicator.
          setIsLoading(false);
          if(isOnline){
          setIsLoading(false);
          toast.warning(`Your username or password is not correct`, {
            position: toast.POSITION.TOP_CENTER,
          });
          }
          else{
            toast.error(`Check your internet connection`, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
    } else {
      // hide loading indicator.
      setIsLoading(false);
      if(isOnline){
      setIsLoading(false);
      toast.warning(`Your username or password is not correct`, {
        position: toast.POSITION.TOP_CENTER,
      });
      }
      else{
        toast.error(`Check your internet connection`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  return (
  // main login
  <div className="signup">
    <ToastContainer />
      <div className="signup__content">
        <div className="signup__container d-flex align-items-center justify-content-between p-2">
        <div className="signup__title">Login</div>
        <p className="fw-bold font-italic">Minter<span className="bg-theme border-theme text-white rounded-pill">Fx</span>Pro</p>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          <input
            type="text"
            placeholder="Email"
            ref={emailRef}
          />
          <div className='d-flex' style={{ position: 'relative' }}>
          <input
            id="password"
            // type="password"
            placeholder="Password"
            ref={passwordRef} 
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          {checkPassword && (
            <button className='p-btn' onClick={()=> setShowPassword(!showPassword)}>{showPassword ? (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/>
              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"/>
            </svg>
            </>
          ) : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
            </>
          )}</button>
          )}
          
          </div>
          <button type="submit" className="signup__btn"  onClick={login}>
            Login
          </button>
          <div className="d-flex justify-content-end mb-2">
          <button type="button" className="remove-default-btn-clear text-primary text-end" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">
            Forgot Password
          </button>
          </div>
          
      
          <span className="login__signup" onClick={() => toggleModal(true)}>Create Account</span>
        </div>
      </div>
     
      <footer className="mt-0 container-fluid fw-bold">
        <div className="row">
          {/*  */}
          <div className="col-lg-3">
           <p>
              
              <ul>
              <h3 className='fw-bold text-theme'>About Us</h3>
                <li>From exceptional customer service, to excellent trading conditions, we make sure that our Clients are always our top priority. As a company, we aspire to continue to improve our services, ensuring that we always maintain ourselves to the highest spectrum of customer satisfaction.</li>
              </ul>
              </p>
          </div>
          {/*  */}
            <div className="col-lg-4">   
            <p>
               <ul className="d-flex flex-straight justify-content-start text-start align-items-start">
                    <h3 className='fw-bold text-theme'>Get In Touch</h3>
                    <li className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-envelope" viewBox="0 0 16 16">
                     <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                    </svg>
                      <span>minterfxpro@gmail.com</span></li>
                </ul>
                </p>
            </div>
            {/*  */}
            <div className="col-lg-2">
                <p>
                <ul className="d-flex flex-straight justify-content-start text-start align-items-start">
                    <h3 className='fw-bold text-theme'>Customer Service</h3>
                    <li className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-telephone" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                    </svg>
                      <span>+44 7425 854141</span></li>
                </ul>
                </p>
            </div>
            {/*  */}
            <div className="col-lg-3">
             
                <p>
                <ul>
                <h3 className='fw-bold text-theme'>Address</h3>
                <li>Nexus Park, Avenue East, Skyline 120, Great Notley, Braintree, Essex, CM77 7AL, England.</li>
                </ul>
                </p>
            </div>
            {/*  */}
        </div>
        <div className="text-center mt-5 mb-1">
            <p>&copy; 2021 Minter Fx Pro</p>
        </div>
      </footer>
      {isLoading && <Loading />}
      <ForgotPasswordModal />
    </div>
  );
}

export default withModal(SignUp)(Login);