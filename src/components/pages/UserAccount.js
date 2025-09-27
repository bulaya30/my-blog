import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UpdateProfile from './Update';
import Password from '../auth/Password';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user.profile);
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return <Navigate to="/login" replace />;

  const overviewFields = [
    { label: t('account.fullName', 'Full Name'), value: `${user.firstName} ${user.lastName}` },
    { label: t('account.company', 'Company'), value: user.company },
    { label: t('account.country', 'Country'), value: user.country },
    { label: t('account.address', 'Address'), value: user.address },
    { label: t('account.phone', 'Phone'), value: user.phone },
    { label: t('account.email', 'Email'), value: user.email }
  ];

  const socialLinks = [
    { icon: 'twitter', url: user.twitter },
    { icon: 'facebook', url: user.facebook },
    { icon: 'instagram', url: user.instagram },
    { icon: 'linkedin', url: user.linkedin }
  ];

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
              {socialLinks.map((link) => (
                <NavLink key={link.icon} to={link.url || '#'} className={link.icon}>
                  <i className={`bi bi-${link.icon}`}></i>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: Tabs */}
      <div className="col-lg-8 col-md-12 col-sm-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body pt-3">
            <ul className="nav nav-underline" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  id="overview-tab"
                  role="tab"
                  aria-controls="overview-panel"
                  aria-selected={activeTab === 'overview'}
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  {t('account.tabs.overview', 'Overview')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  id="edit-tab"
                  role="tab"
                  aria-controls="edit-panel"
                  aria-selected={activeTab === 'edit'}
                  className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                >
                  {t('account.tabs.editProfile', 'Edit Profile')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  id="password-tab"
                  role="tab"
                  aria-controls="password-panel"
                  aria-selected={activeTab === 'password'}
                  className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  {t('account.tabs.changePassword', 'Change Password')}
                </button>
              </li>
            </ul>

            <div className="tab-content pt-2">
              {/* Overview Tab */}
              <div
                id="overview-panel"
                role="tabpanel"
                aria-labelledby="overview-tab"
                className={`tab-pane fade profile-overview ${activeTab === 'overview' ? 'show active' : ''}`}
              >
                <h5 className="card-title">{t('account.about', 'About')}</h5>
                <p className="small fst-italic">{user.about}</p>

                <h5 className="card-title">{t('account.profileDetails', 'Profile Details')}</h5>
                {overviewFields.map(field => (
                  <div className="row" key={field.label}>
                    <div className="col-lg-3 col-md-4 label">{field.label}</div>
                    <div className="col-lg-9 col-md-8">{field.value}</div>
                  </div>
                ))}
              </div>

              {/* Edit Profile Tab */}
              <div
                id="edit-panel"
                role="tabpanel"
                aria-labelledby="edit-tab"
                className={`tab-pane fade profile-edit pt-3 ${activeTab === 'edit' ? 'show active' : ''}`}
              >
                <UpdateProfile />
              </div>

              {/* Change Password Tab */}
              <div
                id="password-panel"
                role="tabpanel"
                aria-labelledby="password-tab"
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
