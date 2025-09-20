import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../store/actions/UserModel'; // 🔹 implement in actions
import { checkPassword } from '../../validation/validate';

const Password = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    renewPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    renewPassword: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  const toggleShow = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!formData.currentPassword?.trim())
      newErrors.currentPassword = "Current password is required.";

    if (!formData.newPassword?.trim())
      newErrors.newPassword = "New password is required.";
    else if (!checkPassword(formData.newPassword))
      newErrors.newPassword =
        "Password must be at least 8 characters, 1 uppercase, 1 lowercase, 1 number.";

    if (!formData.renewPassword?.trim())
      newErrors.renewPassword = "Please confirm your new password.";
    else if (formData.newPassword !== formData.renewPassword)
      newErrors.renewPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return showToast("Please fix the errors first.");
    if (formData.newPassword !== formData.renewPassword) return showToast("Passwords do not match.", "success");
    setLoading(true);
    try {
      // 🔹 Replace with your Redux action
      const result = await dispatch(updatePassword(formData.currentPassword, formData.newPassword));

      if (result.success) {
        showToast("Password updated successfully!", "success");
        setFormData({ currentPassword: "", newPassword: "", renewPassword: "" });
      } else {
        showToast("Failed to update password", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  const renderPasswordField = (id, label) => (
    <div className={`input-box position-relative ${errorClass(id)}`}>
      <input
        type={showPassword[id] ? "text" : "password"}
        id={id}
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
        required
      />
      <label htmlFor={id}>{label}</label>
      <i
        className={`bx ${showPassword[id] ? "bx-show" : "bx-hide"} password-toggle`}
        onClick={() => toggleShow(id)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          cursor: 'pointer',
          transform: 'translateY(-50%)'
        }}
      ></i>
      {errors[id] && <p className="input-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="form-section">
      <form autoComplete="off" onSubmit={handleSubmit}>
        {renderPasswordField("currentPassword", "Current Password")}
        {renderPasswordField("newPassword", "New Password")}
        {renderPasswordField("renewPassword", "Confirm Password")}

        <div className="input-box">
          {!loading ? (
            <button id="new-article-btn" className="btn btn-sm w-50" type="submit">
              Save changes
            </button>
          ) : (
            <button className="btn btn-sm w-50" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span> Saving...</span>
            </button>
          )}
        </div>
      </form>

      {toast.message && (
        <div
          className={`toast-notification ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white p-3 rounded mt-3`}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Password;
