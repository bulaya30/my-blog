import React, { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../store/actions/AuthModel";
import { useTranslation } from "react-i18next";
import firebase from "../../config/DB"; // your Firebase config

const Register = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth.user);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 8000);
  };

  // ----- Validation rules -----
  const validate = () => {
    const newErrors = {};
    if (!formData.fname.trim())
      newErrors.firstName = t("registrationPage.firstNameRequired");
    else if (formData.fname.trim().length < 3)
      newErrors.firstName = t("registrationPage.firstNameLength");

    if (!formData.lname.trim())
      newErrors.lastName = t("registrationPage.lastNameRequired");
    else if (formData.lname.trim().length < 3)
      newErrors.lastName = t("registrationPage.lastNameLength");

    if (!formData.email.trim())
      newErrors.email = t("registrationPage.emailRequired");

    if (!formData.password.trim())
      newErrors.password = t("registrationPage.passwordRequired");
    else if (formData.password.trim().length < 8)
      newErrors.password = t("registrationPage.passwordLength");

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = t("registrationPage.passwordRequired");
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = t("registrationPage.passwordsMismatch");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = (field) => {
    if (field === "password") setShowPassword(!showPassword);
    if (field === "confirmPassword")
      setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate())
      return showToast(t("registrationPage.fixErrors"), "error");

    setLoading(true);
    try {
      const result = await dispatch(signUp(formData));

      if (!result.error) {
        // Send verification email
        showToast(t("A link has been set to verify your email"), "success");
        // showToast(t("registrationPage.verificationSent"), "success");
      //   const user = firebase.auth().currentUser;
      //   if (user) {
      //     const em = await user.sendEmailVerification();
      //     console.log(em)
      //   }
      // } else {
      //   showToast(t("registrationPage.error"), "error");
      }
    } catch (err) {
      showToast(t("registrationPage.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  // Only redirect if email is verified
  if (auth && auth.emailVerified) return <Navigate to="/profile" replace />;

  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div id="main">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5 p-3">
            <div className="auth-container">
              <div className="auth-section">
                <div className="form-container login">
                  <h2 className="form-title">
                    {t("registrationPage.createAccount")}
                  </h2>
                  <div className="auth-info-content login">
                    <h2>{t("registrationPage.joinUs")}</h2>
                    <p>{t("registrationPage.fillDetails")}</p>
                  </div>

                  <form
                    id="registration-form"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <div className={`input-box ${errorClass("firstName")}`}>
                      <input
                        type="text"
                        id="fname"
                        required
                        value={formData.fname}
                        onChange={handleChange}
                      />
                      <label htmlFor="fname">
                        {t("registrationPage.firstName")}
                      </label>
                      {errors.firstName && (
                        <p className="input-error">{errors.firstName}</p>
                      )}
                    </div>

                    <div className={`input-box ${errorClass("lastName")}`}>
                      <input
                        type="text"
                        id="lname"
                        required
                        value={formData.lname}
                        onChange={handleChange}
                      />
                      <label htmlFor="lname">
                        {t("registrationPage.lastName")}
                      </label>
                      {errors.lastName && (
                        <p className="input-error">{errors.lastName}</p>
                      )}
                    </div>

                    <div className={`input-box ${errorClass("email")}`}>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <label htmlFor="email">{t("registrationPage.email")}</label>
                      {errors.email && (
                        <p className="input-error">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div
                      className={`input-box position-relative ${errorClass(
                        "password"
                      )}`}
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <label htmlFor="password">
                        {t("registrationPage.password")}
                      </label>
                      <i
                        className={`bx ${
                          showPassword ? "bx-show" : "bx-hide"
                        } password-toggle`}
                        onClick={() => togglePassword("password")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          cursor: "pointer",
                          transform: "translateY(-50%)",
                        }}
                      ></i>
                      {errors.password && (
                        <p className="input-error">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div
                      className={`input-box position-relative ${errorClass(
                        "confirmPassword"
                      )}`}
                    >
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <label htmlFor="confirmPassword">
                        {t("registrationPage.confirmPassword")}
                      </label>
                      <i
                        className={`bx ${
                          showConfirmPassword ? "bx-show" : "bx-hide"
                        } password-toggle`}
                        onClick={() => togglePassword("confirmPassword")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          cursor: "pointer",
                          transform: "translateY(-50%)",
                        }}
                      ></i>
                      {errors.confirmPassword && (
                        <p className="input-error">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="input-box d-flex input-term mb-3">
                      <input
                        type="checkbox"
                        id="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                      />
                      <label htmlFor="agree" className="term">
                        {t("registrationPage.agree")}{" "}
                        <NavLink to="/terms">{t("registrationPage.terms")}</NavLink>
                      </label>
                    </div>

                    <div className="input-box">
                      {!loading ? (
                        <button
                          id="login-btn"
                          className="btn w-100"
                          type="submit"
                        >
                          {t("registrationPage.registerBtn")}
                        </button>
                      ) : (
                        <button className="btn w-100" type="button" disabled>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="ms-2">
                            {t("registrationPage.registeringBtn")}
                          </span>
                        </button>
                      )}
                    </div>

                    <br />
                    <div className="auth-link">
                      <p>
                        {t("registrationPage.haveAccount")}{" "}
                        <NavLink className="signUp-link" to="/login">
                          {t("registrationPage.loginLink")}
                        </NavLink>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Toast Notification */}
              {toast.message && (
                <div
                  className={`toast-notification ${
                    toast.type === "success" ? "bg-green-500" : "bg-red-500"
                  } text-white p-3 rounded mt-3`}
                  role="alert"
                >
                  {toast.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
