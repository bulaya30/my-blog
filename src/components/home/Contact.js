import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addContact } from '../store/actions/ContactModel';
import { checkName, checkMail } from '../../validation/validate';
import Footer from './footer';

export default function Contact() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 20000);
  };

  // ----- Validation rules -----
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t('contactPage.validation.nameRequired');
    else if (formData.name.trim().length < 3) newErrors.name = t('contactPage.validation.nameLength');
    else if (!checkName(formData.name.trim())) newErrors.name = t('contactPage.validation.nameInvalid');

    if (!formData.email.trim()) newErrors.email = t('contactPage.validation.emailRequired');
    else if (!checkMail(formData.email.trim())) newErrors.email = t('contactPage.validation.emailInvalid');

    if (!formData.message.trim()) newErrors.message = t('contactPage.validation.messageRequired');
    else if (!checkName(formData.message.trim())) newErrors.message = t('contactPage.validation.messageInvalid');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return showToast(t('contactPage.validation.generalError'));

    setLoading(true);
    try {
      const result = dispatch(addContact(formData));
      if (!result.error) {
        showToast(t('contactPage.success'), 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        showToast(t('contactPage.error.failed'), 'error');
      }
    } catch (err) {
      showToast(t('contactPage.error.general'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <>
      <div id="main" className="container py-3">
        <h1 className="text-center mb-2">{t('contactPage.title')}</h1>
        <div className="row">

          {/* Contact Info */}
          <div className="col-lg-4 my-4">
            <div className="card shadow-sm border-0 p-4">
              <h5>{t('contactPage.info.heading')}</h5>
              <p><strong>{t('contactPage.info.labels.address')}:</strong> Kansanga, Kampala/Ouganda</p>
              <p><strong>{t('contactPage.info.labels.phone')}:</strong> +256 750274516</p>
              <p><strong>{t('contactPage.info.labels.email')}:</strong> norrechel@gmail.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="form-section">
              <div className="card shadow-sm border-0 p-4">
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className={`input-box ${errorClass('name')} mb-3`}>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="name" className="form-label">{t('contactPage.form.name')}</label>
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  <div className={`input-box ${errorClass('email')} mb-3`}>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="email" className="form-label">{t('contactPage.form.email')}</label>
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>

                  <div className={`input-box ${errorClass('message')} mb-3`}>
                    <textarea
                      id="message"
                      rows="5"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      disabled={loading}
                    ></textarea>
                    <label htmlFor="message" className="form-label">{t('contactPage.form.message')}</label>
                    {errors.message && <small className="text-danger">{errors.message}</small>}
                  </div>

                  <div className="input-box">
                    <button type="submit" className="btn btn-sm w-100" disabled={loading}>
                      {loading ? t('contactPage.form.button.sending') : t('contactPage.form.button.send')}
                    </button>
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
      <Footer />
    </>
  );
}
