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
    <div id="main" className="container py-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <div className="row">
        {/* Contact Info */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 p-3">
            <h5>Get in Touch</h5>
            <p><strong>Address:</strong> Kansanga, Kampala/Uganda</p>
            <p><strong>Phone:</strong> +256 750274516</p>
            <p><strong>Email:</strong> norrechel@gmail.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            {submitted && (
              <div className="alert alert-success" role="alert">
                Thank you! Your message has been sent.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
