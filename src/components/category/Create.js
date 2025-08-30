import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory } from '../store/actions/categoryModel';

const CreateCategory = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') return;

    setLoading(true);
     const result = await dispatch(addCategory({ name: name.trim() }));
    setLoading(false);
    // If no error, show success
    if (!result.error) {
      setToast({ message: 'Category added successfully!', type: 'success' });
      setTimeout(() => setToast({ message: '', type: '' }), 5000);
      setName(''); // reset input
    } else {
      setToast({ message: result.error, type: 'error' });      
      setTimeout(() => setToast({ message: '', type: '' }), 5000);
    }
  };

  return (
    <div className="form-section">
      <div className="card">
        <h2>New Category</h2>
        <div className="card-body">
          <form id="new-category-form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="errors hide"></div>
              <div className="success-container"></div>
            </div>

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
              <div className="input-errors name">Category name required</div>
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
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CreateCategory;
