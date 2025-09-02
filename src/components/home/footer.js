import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer py-4 mt-4">
        <div className='container'>
            <div className="row gy-4">
                {/* Contact Info */}
                <div className="col-12 col-md-4 footer-contact">
                <h4 className="fw-bold">Norrechel</h4>
                <p>
                    Kansanga, Kampala, Uganda<br />
                    <strong>Phone:</strong> +256 750 274 516<br />
                    <strong>Email:</strong> <a href="mailto:norrechel@gmail.com">norrechel@gmail.com</a>
                </p>
                </div>

                {/* Services */}
                <div className="col-12 col-md-4 footer-links">
                <h4>Our Services</h4>
                <ul className="list-unstyled footer-link">
                    <li><i className="bx bx-chevron-right"></i> <Link to="/web-design">Web Design</Link></li>
                    <li><i className="bx bx-chevron-right"></i> <Link to="/mentorship">Mentorship</Link></li>
                    <li><i className="bx bx-chevron-right"></i> <Link to="/business-consulting">Business Consulting</Link></li>
                </ul>
                </div>

                {/* Social Links */}
                <div className="col-12 col-md-4 footer-links">
                <h4>Connect With Us</h4>
                <p>Follow us for updates, insights, and more.</p>
                <div className="social-links mt-3 d-flex gap-2">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter"><i className="bx bxl-twitter"></i></a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="facebook"><i className="bx bxl-facebook"></i></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram"><i className="bx bxl-instagram"></i></a>
                    <a href="https://skype.com" target="_blank" rel="noopener noreferrer" className="google-plus"><i className="bx bxl-skype"></i></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin"><i className="bx bxl-linkedin"></i></a>
                </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 text-center pt-3">
                &copy; {new Date().getFullYear()} <span className="fw-bold">Norrechel</span>. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer;
