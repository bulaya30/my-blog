import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNotification } from '../store/actions/NotificationsModel';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = ({ notifications, getNotification }) => {
  const [filter, setFilter] = useState('Today');
  // console.log(notifications)
  useEffect(() => {
    const unsubscribe = getNotification(); 
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [getNotification]);

useEffect(() => {
  if (notifications.length === 0) return;
  const latestNotification = notifications[0];
  const lastSeenId = localStorage.getItem('lastSeenNotificationId');

  if (latestNotification.id !== lastSeenId) {
    toast.info(`New visitor read: ${latestNotification.blogTitle}`);
    localStorage.setItem('lastSeenNotificationId', latestNotification.id);
  }
}, [notifications]);


  const handleFilterChange = (period) => setFilter(period);

  const filteredNotifications = notifications.filter((n) => {
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
        <div className="filter">
          <NavLink to='#' className="icon" data-bs-toggle="dropdown">
            <i className="bi bi-three-dots"></i>
          </NavLink>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start"><h6>Filter</h6></li>
            {['Today','This Month','This Year'].map(period => (
              <li key={period}>
                <NavLink
                  to="#"
                  className={`dropdown-item ${filter === period ? 'active' : ''}`}
                  onClick={() => handleFilterChange(period)}
                >
                  {period}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">
          <h5 className="card-title">Recent Notifications <span>| {filter}</span></h5>
          <div className="activity">
            {filteredNotifications.map(n => (
              <div className="activity-item d-flex" key={n.id}>
                <div className="activite-label">
                  {moment(n.createdAt.toDate()).fromNow()}
                </div>
                <i className='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                <div className="activity-content">
                    <h4>{n.title}</h4>
                  <p>{n.message} </p>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && <p>No notifications found for {filter}.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) =>{ 
  // console.log(state)
  return{
    notifications: state.notification.notifications || []
  }
};

const mapDispatchToProps = (dispatch) => ({
  getNotification: () => dispatch(getNotification())
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
