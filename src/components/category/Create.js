import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { addCategory } from '../store/actions/categoryModel';
import { checkName } from '../../validation/validate';
import { useTranslation } from 'react-i18next';

const CreateCategory = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const admin = useSelector((state) => state.auth.isAdmin);
  const auth = useSelector((state) => state.auth.user);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  const validateCategory = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t("createCategory.nameRequired");
    else if (!checkName(name.trim())) newErrors.name = t("createCategory.nameInvalid");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin) return showToast(t("createCategory.notAllowed"));

    if (!validateCategory())
      return showToast(t("createCategory.fixErrors"), "error");

    setLoading(true);
    try {
      const result = await dispatch(addCategory({ name: name.trim() }));
      if (!result.error) {
        showToast(t("createCategory.success"), "success");
        setName('');
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      showToast(t("createCategory.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <Navigate to="/login" replace />;

  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>{t("createCategory.newCategory")}</h2>
        <div className="card-body">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={`input-box ${errorClass('name')}`}>
              <input
                type="text"
                name="name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="name">{t("createCategory.name")}</label>
              {errors.name && <p className="input-error">{errors.name}</p>}
            </div>

            <div className="input-box">
              {!loading ? (
                <button className="btn btn-sm w-100" type="submit">
                  {t("createCategory.add")}
                </button>
              ) : (
                <button className="btn btn-sm w-100" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span> {t("createCategory.adding")}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {toast.message && (
        <div
          className={`toast-notification ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded mt-3`}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CreateCategory;
