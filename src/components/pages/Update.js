import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/actions/UserModel';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.auth.user.profile);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    address: '',
    phone: '',
    title: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    about: '',
    photo: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) setFormData(prev => ({ ...prev, ...profile }));
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePhotoChange = (file) => {
    setFormData({ ...formData, photo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setSuccess(true); // Show success toast
    setTimeout(() => setSuccess(false), 3000); // Hide after 3 seconds
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="form-section">
      <form id="profile-edit-form" autoComplete="off" encType="multipart/form-data" onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div className="row mb-3">
          <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
          <div className="col-md-8 col-lg-9">
            <img
              src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo || "logo.png"}
              alt="Profile"
              className="img-preview"
            />
            <div className="pt-2 mb-3">
              <div className="input-box">
                <input
                  accept="image/*"
                  type="file"
                  id="file"
                  name="file"
                  onChange={(e) => handlePhotoChange(e.target.files[0])}
                />
                <label htmlFor="file" className="btn btn-primary btn-sm text-white" title="Upload new profile image">
                  <i className="bi bi-upload"></i>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Text inputs */}
        {['firstName','lastName','about','company','title','country','address','phone','twitter','facebook','instagram','linkedin'].map(field => (
          <div className="row mb-3" key={field}>
            <div className="input-box">
              {field === 'about' ? (
                <>
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <textarea id={field} value={formData[field] || ''} onChange={handleChange} />
                </>
              ) : (
                <>
                  <input type="text" id={field} value={formData[field] || ''} required onChange={handleChange} />
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                </>
              )}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button type="submit" className="btn btn-sm save-btn">Save Changes</button>
          <button className="btn btn-sm loading-btn" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>Saving...</span>
          </button>
        </div>
      </form>

      {/* Success Toast */}
      {success && (
        <div className="toast-notification">
          Profile updated successfully!
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
