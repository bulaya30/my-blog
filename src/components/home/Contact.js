import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate Firebase, API, or email service
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div id="main" className="container py-3">
      <h1 className="text-center mb-2">Contact Us</h1>
      <div className="row">
        {/* Contact Info */}
        <div className="col-lg-4 my-4">
          <div className="card shadow-sm border-0 p-4">
            <h5>Get in Touch</h5>
            <p><strong>Address:</strong> Kansanga, Kampala/Uganda</p>
            <p><strong>Phone:</strong> +256 750274516</p>
            <p><strong>Email:</strong> norrechel@gmail.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="form-section">
            <div className="card shadow-sm border-0 p-4">
              {submitted && (
                <div className="alert alert-success" role="alert">
                  Thank you! Your message has been sent.
                </div>
              )}
              <form onSubmit={handleSubmit} autoComplete='off'>
                <div className="input-box">
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="name" className="form-label">Full Name</label>
                </div>

                <div className="input-box">
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email" className="form-label">Email Address</label>
                </div>

                <div className="input-box">
                  <textarea
                    id="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  <label htmlFor="message" className="form-label">Message</label>
                </div>
                <div className='input-box'>
                  <button type="submit" className="btn btn-sm w-100">
                    Send Message
                  </button>

                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
