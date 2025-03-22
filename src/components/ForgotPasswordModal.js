import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Loading from './Loading';
import { ToastContainer, toast } from "react-toastify";

function ForgotPasswordModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    setIsLoading(true);
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsLoading(false);

        toast.success(`Password reset email sent!`, {
          toastId: 'toast-send-sucess',
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(`Failed to send reset email!`, {
            toastId: 'toast-send-fail',
          });
      });
  };

  return (
    <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
         <ToastContainer />
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="forgotPasswordModalLabel">Forgot Password</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Please enter your email address below. We'll send you a link to reset your password.</p>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">Email address</label>
              <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-theme" onClick={handleResetPassword}>Send Reset Email</button>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default ForgotPasswordModal;
