import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory } from '../store/actions/categoryModel';

const CreateCategory = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return showToast('Category name is required.', 'error');
    }

    setLoading(true);

    try {
      const result = await dispatch(addCategory({ name: name.trim() }));
      if (!result.error) {
        showToast('Category added successfully!', 'success');
        setName(''); // reset input
      } else {
        showToast(result.error || 'Failed to add category', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>New Category</h2>
        <div className="card-body">
          <form id="new-category-form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                required
                onChange={handleChange}
              />
              <label htmlFor="name">Name</label>
            </div>

            <div className="input-box">
              <button
                id="new-category-btn"
                className="btn btn-sm w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`toast-notification ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white p-3 rounded mt-3`}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CreateCategory;
