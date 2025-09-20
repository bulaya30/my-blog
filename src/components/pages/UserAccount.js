import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UpdateProfile from './Update';
import Password from '../auth/Password';

const Account = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('overview');

   if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="row">
      {/* Left column: Profile info */}
      <div className="col-lg-4 col-md-12 col-sm-12">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <img src={user.photo || "logo.png"} alt="" className="rounded-circle" />
            <h2>{user.firstName} {user.lastName}</h2>
            <h3>{user.title}</h3>
            <div className="social-links mt-2">
              <NavLink to="#" className="twitter"><i className="bi bi-twitter"></i></NavLink>
              <NavLink to="#" className="facebook"><i className="bi bi-facebook"></i></NavLink>
              <NavLink to="#" className="instagram"><i className="bi bi-instagram"></i></NavLink>
              <NavLink to="#" className="linkedin"><i className="bi bi-linkedin"></i></NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: Tabs for Overview / Edit / Password */}
      <div className="col-lg-8 col-md-12 col-sm-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body pt-3">
            <ul className="nav nav-underline">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                >
                  Edit Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  Change Password
                </button>
              </li>
            </ul>

            <div className="tab-content pt-2">
              {/* Profile Overview */}
              <div
                className={`tab-pane fade profile-overview ${activeTab === 'overview' ? 'show active' : ''}`}
              >
                <h5 className="card-title">About</h5>
                <p className="small fst-italic">{user.about}</p>

                <h5 className="card-title">Profile Details</h5>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Full Name</div>
                  <div className="col-lg-9 col-md-8">{user.firstName} {user.lastName}</div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Company</div>
                  <div className="col-lg-9 col-md-8">{user.company}</div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Country</div>
                  <div className="col-lg-9 col-md-8">{user.country}</div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Address</div>
                  <div className="col-lg-9 col-md-8">{user.address}</div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Phone</div>
                  <div className="col-lg-9 col-md-8">{user.phone}</div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Email</div>
                  <div className="col-lg-9 col-md-8">{user.email}</div>
                </div>
              </div>

              {/* Edit Profile */}
              <div
                className={`tab-pane fade profile-edit pt-3 ${activeTab === 'edit' ? 'show active' : ''}`}
              >
                <UpdateProfile />
              </div>

              {/* Change Password */}
              <div
                className={`tab-pane fade profile-edit pt-3 ${activeTab === 'password' ? 'show active' : ''}`}
              >
                <Password />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
