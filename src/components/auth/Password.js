import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../store/actions/UserModel';
import { checkPassword } from '../../validation/validate';
import { useTranslation } from 'react-i18next';

const Password = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      newErrors.currentPassword = t('passwordPage.currentRequired');

    if (!formData.newPassword?.trim())
      newErrors.newPassword = t('passwordPage.newRequired');
    else if (!checkPassword(formData.newPassword))
      newErrors.newPassword = t('passwordPage.newInvalid');

    if (!formData.renewPassword?.trim())
      newErrors.renewPassword = t('passwordPage.confirmRequired');
    else if (formData.newPassword !== formData.renewPassword)
      newErrors.renewPassword = t('passwordPage.passwordMismatch');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return showToast(t('passwordPage.fixErrors'), 'error');

    setLoading(true);
    try {
      const result = await dispatch(updatePassword(formData.currentPassword, formData.newPassword));

      if (result.success) {
        showToast(t('passwordPage.success'), 'success');
        setFormData({ currentPassword: "", newPassword: "", renewPassword: "" });
      } else {
        showToast(result.error || t('passwordPage.fail'), 'error');
      }
    } catch {
      showToast(t('passwordPage.errorOccurred'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  const renderPasswordField = (id, labelKey) => (
    <div className={`input-box position-relative ${errorClass(id)}`}>
      <input
        type={showPassword[id] ? "text" : "password"}
        id={id}
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
        required
      />
      <label htmlFor={id}>{t(labelKey)}</label>
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
        {renderPasswordField("currentPassword", "passwordPage.currentLabel")}
        {renderPasswordField("newPassword", "passwordPage.newLabel")}
        {renderPasswordField("renewPassword", "passwordPage.confirmLabel")}

        <div className="input-box">
          {!loading ? (
            <button id="save-password-btn" className="btn btn-sm w-50" type="submit">
              {t('passwordPage.saveBtn')}
            </button>
          ) : (
            <button className="btn btn-sm w-50" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span> {t('passwordPage.saving')}</span>
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
