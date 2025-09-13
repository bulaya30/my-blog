import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../store/actions/AuthModel';
import firebase from '../../config/DB';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const authError = useSelector((state) => state.auth.authError);
  const auth = firebase.auth().currentUser;
  const [toast, setToast] = useState({ message: '', type: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 8000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
    // ----- Validation rules -----
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email =` {t('loginPage.emailRequired')}`;
    if (!password.trim()) newErrors.password =` {t('loginPage.passwordRequired')}`;
    else if (password.trim().length < 8) newErrors.password = "Password must be at least 5 characters long.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return showToast("Please fix the errors before submitting.", "error");
    setLoading(true);
    try {
     const result = await dispatch(signIn({ email, password }));
     if (!result.error) {
        return <Navigate to="/profile" replace />;
      } else {
        showToast(`{t('loginPage.error')}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (auth) return <Navigate to="/profile" replace />;
  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div id="main" className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-8 col-sm-10">
            <div className="auth-container">
              <div className="form-container login">
                <h2 className="form-title text-center my-4">{t('loginPage.welcome')}</h2>
                <div className="auth-info-content login text-center mb-3">
                  <h4>{t('loginPage.signInInfo')}</h4>
                </div>

                {authError && <div className="errors">{authError}</div>}

                <form id="login-form" autoComplete="off" onSubmit={handleSubmit}>
                  <div className={`input-box ${errorClass('email')}`}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      onChange={handleChange}
                      value={email}
                    />
                    <label htmlFor="email">{t('loginPage.emailLabel')}</label>
                    {errors.email && <p className="input-error">{errors.email}</p>}
                  </div>

                  <div className={`input-box position-relative ${errorClass('password')}`}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      onChange={handleChange}
                      value={password}
                    />
                    <label htmlFor="password">{t('loginPage.passwordLabel')}</label>
                    <i
                      className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} password-toggle`}
                      onClick={togglePassword}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        cursor: 'pointer',
                        transform: 'translateY(-50%)',
                      }}
                    ></i>
                    {errors.password && <p className="input-error">{errors.password}</p>}
                  </div>

                  <div className="input-box">
                    {!loading ? (
                      <button id="login-btn" className="btn w-100" type="submit">
                        {t('loginPage.loginBtn')}
                      </button>
                    ) : (
                      <button className="btn w-100 " type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">{t('loginPage.loggingInBtn')}</span>
                      </button>
                    )}
                  </div>

                  <div className="auth-link mt-3 text-center">
                    <p>
                      {t('loginPage.noAccount')}
                      <NavLink className="signUp-link ms-1" to="/register">
                       {t('loginPage.registerLink')}
                      </NavLink>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            {/* Toast Notification */}
            {toast.message && (
              <div
                className={`toast-notification ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded mt-3`}
                role="alert"
              >
                {toast.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
