import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import { updateCategory, getCategory } from '../store/actions/categoryModel'; 
import { checkName } from '../../validation/validate';
import { useTranslation } from 'react-i18next';

const EditCategory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [toast, setToast] = useState({ message: '', type: '' });
  const admin = useSelector((state) => state.auth.isAdmin);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  
  const category = useSelector((state) =>
    Array.isArray(state.category.categories)
      ? state.category.categories.find((b) => b.id === id)
      : state.category.categories?.id === id
      ? state.category.categories
      : null
  );

  // Fetch category by ID
  useEffect(() => {
    dispatch(getCategory('id', id));
  }, [dispatch, id]);

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 20000);
  };

  // ----- Validation rules -----
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t('editCategory.nameRequired');
    else if (name.trim().length < 5) newErrors.name = t('editCategory.nameMinLength');
    else if (!checkName(name.trim())) newErrors.name = t('editCategory.nameInvalid');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!admin) return showToast(t('editCategory.notAllowed'));

    if (!validate()) return showToast(t('editCategory.fixErrors'));
    setLoading(true);
    try {
      const result = dispatch(updateCategory({ id, name }));
      if (!result.error) {
        showToast(t('editCategory.updatedSuccess'), 'success');
      } else {
        showToast(t('editCategory.updatedFailed'));
      }
    } catch (err) {
      showToast(t('editCategory.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return <Navigate to="/login" replace />;

  const errorClass = (field) => (errors[field] ? 'input-error-border' : '');

  return (
    <div id="main">
      <div className="container">
        <div className="row">
          <div className="form-section">
            <div className="card border-0 shadow-sm mt-3">
              <h2>{t('editCategory.title')}</h2>
              <div className="card-body">
                <form onSubmit={handleSubmit} id="edit-category-form" autoComplete="off">
                  <div className={`input-box ${errorClass('name')}`}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="name">{t('editCategory.nameLabel')}</label>
                    {errors.name && <p className="input-error">{errors.name}</p>}
                  </div>
                  <div className="input-box">
                    {!loading ? (
                      <button className="btn btn-sm w-100" type="submit">
                        {t('editCategory.saveBtn')}
                      </button>
                    ) : (
                      <button className="btn btn-sm w-100" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span> {t('editCategory.saving')}</span>
                      </button>
                    )}
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

export default EditCategory;
