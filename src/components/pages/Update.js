import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { updateProfile } from '../store/actions/UserModel';
import { checkName, checkString, checkPhone, checkURL } from '../../validation/validate';
import { useTranslation } from 'react-i18next';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const profile = useSelector(state => state.auth.user.profile);

  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  useEffect(() => {
    if (profile) setFormData(prev => ({ ...prev, ...profile }));
  }, [profile]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 8000);
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = t("profileUpdatePage.errors.firstNameRequired");
    else if (formData.firstName.trim().length < 3) newErrors.firstName = t("profileUpdatePage.errors.firstNameLength");
    else if (!checkName(formData.firstName.trim())) newErrors.firstName = t("profileUpdatePage.errors.invalidName");

    if (!formData.lastName?.trim()) newErrors.lastName = t("profileUpdatePage.errors.lastNameRequired");
    else if (formData.lastName.trim().length < 3) newErrors.lastName = t("profileUpdatePage.errors.lastNameLength");
    else if (!checkName(formData.lastName.trim())) newErrors.lastName = t("profileUpdatePage.errors.invalidName");

    if (!formData.company?.trim()) newErrors.company = t("profileUpdatePage.errors.companyRequired");
    else if (!checkName(formData.company?.trim())) newErrors.company = t("profileUpdatePage.errors.invalidName");

    if (!formData.country?.trim()) newErrors.country = t("profileUpdatePage.errors.countryRequired");
    else if (!checkName(formData.country?.trim())) newErrors.country = t("profileUpdatePage.errors.invalidName");

    if (!formData.address?.trim()) newErrors.address = t("profileUpdatePage.errors.addressRequired");
    else if (!checkString(formData.address?.trim())) newErrors.address = t("profileUpdatePage.errors.invalidAddress");

    if (!formData.phone?.trim()) newErrors.phone = t("profileUpdatePage.errors.phoneRequired");
    else if (!checkPhone(formData.phone?.trim())) newErrors.phone = t("profileUpdatePage.errors.invalidPhone");

    if (!formData.title?.trim()) newErrors.title = t("profileUpdatePage.errors.titleRequired");
    else if (!checkName(formData.title?.trim())) newErrors.title = t("profileUpdatePage.errors.invalidName");

    ["facebook", "twitter", "instagram", "linkedin"].forEach(platform => {
      if (!formData[platform]?.trim()) newErrors[platform] = t(`profile.errors.${platform}Required`);
      else if (!checkURL(formData[platform]?.trim())) newErrors[platform] = t("profileUpdatePage.errors.invalidURL");
    });

    if (!formData.about?.trim()) newErrors.about = t("profileUpdatePage.errors.aboutRequired");
    else if (!checkString(formData.about?.trim())) newErrors.about = t("profileUpdatePage.errors.invalidContent");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return showToast(t("profileUpdatePage.errors.fixErrors"), 'error');

    setLoading(true);
    try {
      const result = await dispatch(updateProfile(formData));
      if (!result.error) showToast(t("profileUpdatePage.successUpdated"), 'success');
      else showToast(result.error || t("profileUpdatePage.errors.updateFailed"), 'error');
    } catch (err) {
      showToast(err.message || t("profileUpdatePage.errors.updateFailed"), 'error');
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
          <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">{t("profileUpdatePage.uploadPhoto")}</label>
          <div className="col-md-8 col-lg-9">
            <img
              src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo || "logo.png"}
              alt={t("profileUpdatePage.uploadPhoto")}
              className="img-preview"
            />
            <div className="pt-2 mb-3">
              <div className={`input-box ${errorClass('photo')}`}>
                <input
                  accept="image/*"
                  type="file"
                  id="file"
                  name="file"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                />
                <label htmlFor="file" className="mt-3 btn btn-primary btn-sm text-white" title={t("profileUpdatePage.uploadPhoto")}>
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
                  <label className='user-bio ps-3' htmlFor={field}>{t(`profileUpdatePage.fields.${field}`)}</label>
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
                  <label className='ps-3' htmlFor={field}>{t(`profileUpdatePage.fields.${field}`)}</label>
                </>
              )}
              {errors[field] && <p className="input-error">{errors[field]}</p>}
            </div>
          </div>
        ))}

        <div className="input-box">
          {!loading ? (
            <button className="btn btn-sm w-50" type="submit">{t("profileUpdatePage.saveChanges")}</button>
          ) : (
            <button className="btn btn-sm w-50" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span> {t("profileUpdatePage.saving")}</span>
            </button>
          )}
        </div>
      </form>

      {toast.message && (
        <div className={`toast-notification ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded mt-3`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
