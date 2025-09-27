import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notifications from '../Notification/Notifications';

const Dashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [visitsFilter, setVisitsFilter] = useState('Today');
  const [commentsFilter, setCommentsFilter] = useState('Today');
  const [recentFilter, setRecentFilter] = useState('Today');

  // Translated periods
  const periods = [t('dashboard.today'), t('dashboard.thisMonth'), t('thisYear')];
  if (!user) return <Navigate to="/login" replace />;
  return (
    <article className="dashboard">
      <div className="row">
        <div className="col-lg-8 col-md-12 col-sm-12 mb-2">
          <div className="row">
            {/* Visits card */}
            <div className="col-lg-6 col-md-6 mb-2">
              <div className="card border-0 shadow-small info-card visits-card position-relative">
                <div className="filter position-absolute">
                  <NavLink to="#" className="icon" data-bs-toggle="dropdown">
                    <i className="bi bi-three-dots"></i>
                  </NavLink>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>{t('filter')}</h6>
                    </li>
                    {periods.map(period => (
                      <li key={period}>
                        <button
                          className={`dropdown-item ${visitsFilter === period ? 'active' : ''}`}
                          onClick={() => setVisitsFilter(period)}
                        >
                          {period}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {t('visits')} <span>| {visitsFilter}</span>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="ps-3">
                      <h6>145</h6>
                      <span className="text-success small pt-1 fw-bold">12%</span>
                      <span className="text-muted small pt-2 ps-1">{t('increase')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments card */}
            <div className="col-lg-6 col-md-6">
              <div className="card border-0 info-card visits-card position-relative">
                <div className="filter position-absolute">
                  <NavLink to="#" className="icon" data-bs-toggle="dropdown">
                    <i className="bi bi-three-dots"></i>
                  </NavLink>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>{t('filter')}</h6>
                    </li>
                    {periods.map(period => (
                      <li key={period}>
                        <button
                          className={`dropdown-item ${commentsFilter === period ? 'active' : ''}`}
                          onClick={() => setCommentsFilter(period)}
                        >
                          {period}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {t('comments')} <span>| {commentsFilter}</span>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="ps-3">
                      <h6>25</h6>
                      <span className="text-success small pt-1 fw-bold">5%</span>
                      <span className="text-muted small pt-2 ps-1">{t('increase')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently viewed */}
            <div className="col-12">
              <div className="card recent-view overflow-auto mt-3 info-card position-relative">
                <div className="filter position-absolute">
                  <NavLink to="#" className="icon" data-bs-toggle="dropdown">
                    <i className="bi bi-three-dots"></i>
                  </NavLink>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>{t('filter')}</h6>
                    </li>
                    {periods.map(period => (
                      <li key={period}>
                        <button
                          className={`dropdown-item ${recentFilter === period ? 'active' : ''}`}
                          onClick={() => setRecentFilter(period)}
                        >
                          {period}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {t('recentViewed')} <span>| {recentFilter}</span>
                  </h5>
                  <table className="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">{t('dashboard.visitor')}</th>
                        <th scope="col">{t('dashboard.article')}</th>
                        <th scope="col">{t('dashboard.date')}</th>
                        <th scope="col">{t('dashboard.time')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Brandon Jacob</td>
                        <td><a href="/blog">Self-Mastery</a></td>
                        <td>09/July/2025</td>
                        <td>03:20 PM</td>
                      </tr>
                      <tr>
                        <td>Bridie Kessler</td>
                        <td><a href="/blog">Time Management</a></td>
                        <td>05/July/2025</td>
                        <td>11:45 AM</td>
                      </tr>
                      <tr>
                        <td>Jack Ma</td>
                        <td><a href="/blog">Developing a strong Mindset</a></td>
                        <td>03/July/2025</td>
                        <td>10:30 AM</td>
                      </tr>
                      <tr>
                        <td>John Falase</td>
                        <td><a href="/blog">Leadership</a></td>
                        <td>01/July/2025</td>
                        <td>02:30 PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="col-lg-4 col-md-8 col-sm-12 d-none d-lg-block">
          <Notifications />
        </div>
      </div>
    </article>
  );
};

export default Dashboard;
