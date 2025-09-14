import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotification } from '../store/actions/NotificationsModel';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification.notifications || []);
  
  const [filter, setFilter] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    const unsubscribe = dispatch(getNotification());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Show toast for new notifications
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    const latestNotification = notifications[0];
    const lastSeenId = localStorage.getItem('lastSeenNotificationId');

    if (latestNotification.id !== lastSeenId) {
      toast.info(
        t('notifications.toast.newVisitor', { blogTitle: latestNotification.blogTitle })
      );
      localStorage.setItem('lastSeenNotificationId', latestNotification.id);
    }
  }, [notifications, t]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (period) => {
    setFilter(period);
    setDropdownOpen(false);
  };

  const filteredNotifications = notifications.filter(n => {
    if (!n.createdAt) return false;
    const createdAt = n.createdAt.toDate();
    const now = new Date();

    if (filter === 'Today') return createdAt.toDateString() === now.toDateString();
    if (filter === 'This Month') return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    if (filter === 'This Year') return createdAt.getFullYear() === now.getFullYear();
    return true;
  });

  return (
    <div className='row p-3'>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="card shadow-small info-card">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">
              {t('notifications.title')} <span>| {t(`notifications.filters.${filter}`)}</span>
            </h5>
            
            {/* Filter button */}
            <div className="filter position-relative" ref={dropdownRef} >
              <button
                className="icon btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="bi bi-three-dots"></i>
              </button>
              {dropdownOpen && (
                <ul
                  className="notification-dropdown-menu-end dropdown-menu dropdown-menu-end dropdown-menu-arrow show"
                >
                  <li className="dropdown-header text-start">
                    <h6>{t('notifications.filterTitle')}</h6>
                  </li>
                  {['Today', 'This Month', 'This Year'].map(period => (
                    <li key={period}>
                      <button
                        className={`dropdown-item ${filter === period ? 'active' : ''}`}
                        onClick={() => handleFilterChange(period)}
                      >
                        {t(`notifications.filters.${period}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="activity">
            {filteredNotifications.map(n => (
              <div className="activity-item d-flex" key={n.id}>
                <div className="activite-label">
                  {moment(n.createdAt.toDate()).fromNow()}
                </div>
                <i className='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                <div className="activity-content">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <p>{t('notifications.noResults', { filter: t(`notifications.filters.${filter}`) })}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
