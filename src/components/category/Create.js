import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { addCategory } from '../store/actions/categoryModel';
import { checkName } from '../../validation/validate';

const CreateCategory = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
   const admin = useSelector((state) => state.auth.isAdmin);
   const auth = useSelector((state) => state.auth.user);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 8000);
  };
  // ----- Validation rules -----
  const validateBlog = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required.";
    if (!checkName(name.trim())) newErrors.name = "Invalid category name.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin) return showToast("Not allowed");

    if (!validateBlog()) return showToast("Invalid category name\nPlease fix the errors before submitting.", 'error');

    setLoading(true);

    try {
      const result = await dispatch(addCategory({ name: name.trim() }));
      if (!result.error) {
        showToast('Category added successfully!', 'success');
        setName(''); // reset input
      } else {
        showToast('Failed to add category', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };
   if(!auth) return <Navigate to="/login" replace />;
  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>New Category</h2>
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
              <label htmlFor="name">Name</label>
              {errors.name && <p className="input-error">{errors.name}</p>}
            </div>

            <div className="input-box">
              {!loading ? (
                <button className="btn btn-sm w-100" type="submit">
                  Add
                </button>
              ) : (
                <button className="btn btn-sm w-100" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span> Adding...</span>
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
  );
};

export default CreateCategory;
