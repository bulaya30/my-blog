import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { updateProfile } from '../store/actions/UserModel';
import { checkName, checkString, checkPhone, checkURL } from '../../validation/validate';

const UpdateProfile = () => {
  const dispatch = useDispatch();
      // const st = useSelector(state => state);
  const profile = useSelector(state => state.auth.user.profile);

  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // All fields in one state (instead of many)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    address: "",
    phone: "",
    title: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    about: "",
    photo: ""
  });

  // Load profile into form
  useEffect(() => {
    if (profile) setFormData(prev => ({ ...prev, ...profile }));
  }, [profile]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 8000);
  };

  // Validation
  const validateProfile = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = "Firstname is required.";
    else if (formData.firstName.trim().length < 3) newErrors.firstName = "Firstname must be at least 3 characters long.";
    else if (!checkName(formData.firstName.trim())) newErrors.firstName = "Invalid name.";

    if (!formData.lastName?.trim()) newErrors.lastName = "Lastname is required.";
    else if (formData.lastName.trim().length < 3) newErrors.lastName = "Lastname must be at least 3 characters long.";
    else if (!checkName(formData.lastName.trim())) newErrors.lastName = "Invalid name.";

    if (!formData.company?.trim()) newErrors.company = "Company is required.";
    if (!checkName(formData.company?.trim())) newErrors.company = "Invalid name.";

    if (!formData.country?.trim()) newErrors.country = "Country is required.";
    if (!checkName(formData.country?.trim())) newErrors.country = "Invalid name.";

    if (!formData.address?.trim()) newErrors.address = "Address is required.";
    if (!checkString(formData.address?.trim())) newErrors.address = "Invalid name.";

    if (!formData.phone?.trim()) newErrors.phone = "Phone is required.";
    if (!checkPhone(formData.phone?.trim())) newErrors.phone = "Invalid phone number.";

    if (!formData.title?.trim()) newErrors.title = "Title is required.";
    if (!checkName(formData.title?.trim())) newErrors.title = "Invalid name.";

    if (!formData.facebook?.trim()) newErrors.facebook = "Facebook is required.";
    if (!checkURL(formData.facebook?.trim())) newErrors.facebook = "Invalid URL address.";

    if (!formData.twitter?.trim()) newErrors.twitter = "Twitter is required.";
    if (!checkURL(formData.twitter?.trim())) newErrors.twitter = "Invalid URL address.";

    if (!formData.instagram?.trim()) newErrors.instagram = "Instagram is required.";
    if (!checkURL(formData.instagram?.trim())) newErrors.instagram = "Invalid URL address.";

    if (!formData.linkedin?.trim()) newErrors.linkedin = "Linkedin is required.";
    if (!checkURL(formData.linkedin?.trim())) newErrors.linkedin = "Invalid URL address.";

    if (!formData.about?.trim()) newErrors.about = "About is required.";
    if (!checkString(formData.about?.trim())) newErrors.about = "Invalid name.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return showToast("Please fix the errors before submitting.", 'error');

    setLoading(true);
    try {
      const result = await dispatch(updateProfile(formData));
      if (!result.error) {
        showToast('User information updated successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to update user information', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

   if (!profile) return <Navigate to="/login" replace />;
  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div className="form-section">
      <form className='edit-form' autoComplete="off" encType="multipart/form-data" onSubmit={handleSubmit}>
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
              <div className={`input-box ${errorClass('name')}`}>
                <input
                  accept="image/*"
                  type="file"
                  id="file"
                  name="file"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                />
                <label htmlFor="file" className="mt-3 btn btn-primary btn-sm text-white" title="Upload new profile image">
                  <i className="bi bi-upload"></i>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Text inputs */}
        {['firstName','lastName','about','company','title','country','address','phone','twitter','facebook','instagram','linkedin'].map(field => (
          <div className="row mb-3" key={field}>
            <div className={`input-box ${errorClass(field)}`}>
              {field === 'about' ? (
                <>
                  <label className='user-bio' htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <textarea
                    id={field}
                    required
                    value={formData[field] || ""}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    id={field}
                    required
                    value={formData[field] || ""}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                </>
              )}
              {errors[field] && <p className="input-error">{errors[field]}</p>}
            </div>
          </div>
        ))}

        <div className="input-box">
          {!loading ? (
            <button className="btn btn-sm w-50" type="submit">
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

      {/* Toast */}
      {toast.message && (
        <div className={`toast-notification ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded mt-3`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
