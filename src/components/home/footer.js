import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer id="footer" className="profile-footer">
    <div className="footer-top">
      <div className="container">
        <div className="row">
          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 footer-contact">
            <h4 className="fw-bold">Norrechel</h4>
            <p>
              Kansanga<br />
              Kampala/Uganda<br />
              <strong>Phone:</strong> +256 750274516<br />
              <strong>Email:</strong> norrechel@gmail.com<br />
            </p>
          </div>

          {/* Services */}
          <div className="col-lg-4 col-md-6 footer-links">
            <h4>Autres Service</h4>
            <ul>
              <li><i className="bx bx-chevron-right"></i> <Link to="/web-design">Web Design</Link></li>
              <li><i className="bx bx-chevron-right"></i> <Link to="/graphic-design">Graphic Design</Link></li>
              <li><i className="bx bx-chevron-right"></i> <Link to="/product-management">Product Management</Link></li>
              <li><i className="bx bx-chevron-right"></i> <Link to="/marketing">Marketing</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-lg-4 col-md-6 footer-links">
            <h4>Our Social Networks</h4>
            <p>Cras fermentum odio eu feugiat lide par naso tierra videa magna derita valies</p>
            <div className="social-links mt-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter"><i className="bx bxl-twitter"></i></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="facebook"><i className="bx bxl-facebook"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram"><i className="bx bxl-instagram"></i></a>
              <a href="https://skype.com" target="_blank" rel="noopener noreferrer" className="google-plus"><i className="bx bxl-skype"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin"><i className="bx bxl-linkedin"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="container copyright">
      <div className="text-light p-2">&copy; Copyright <span>Norrechel</span>. All Rights Reserved</div>
    </div>
  </footer>
);

export default Footer;
