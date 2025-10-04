import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notifications from '../Notification/Notifications';
import { getContacts, deleteContact } from '../store/actions/ContactModel';
import ConfirmModal from '../models/confirmModel';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const subscribers = useSelector((state) => state.subscriber.subscribers);
  const contacts = useSelector((state) => state.contact.messages);

  const [visitsFilter, setVisitsFilter] = useState('All');
  const [commentsFilter, setCommentsFilter] = useState('All');
  const [recentFilter, setRecentFilter] = useState('This Month');
// Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  const safeSubscribers = Array.isArray(subscribers) ? subscribers : subscribers ? [subscribers] : [];
  const safeContacts = Array.isArray(contacts) ? contacts : contacts ? [contacts] : [];

  const periods = [
    t('dashboard.all', 'All'),
    t('dashboard.today', 'Today'),
    t('dashboard.thisMonth', 'This Month'),
    t('dashboard.thisYear', 'This Year'),
  ];

  const handleDeleteClick = (id) => {
    setSelectedContact(id);
    setShowModal(true);
  };
  const handleConfirm = async () => {
      if (selectedContact) {
        await dispatch(deleteContact(selectedContact));
        setShowModal(false);
        setSelectedContact(null);
      }
    };
  
    const handleCancel = () => {
      setShowModal(false);
      setSelectedContact(null);
    };
  if (!user) return <Navigate to="/login" replace />;

  const filterByDate = (items, filter) => {
    const now = new Date();
    return items.filter((item) => {
      if (!item.createdAt?.toDate) return true;
      const createdAtDate = item.createdAt.toDate();

      if (filter === t('dashboard.today')) return createdAtDate.toDateString() === now.toDateString();
      if (filter === t('dashboard.thisMonth'))
        return createdAtDate.getMonth() === now.getMonth() && createdAtDate.getFullYear() === now.getFullYear();
      if (filter === t('dashboard.thisYear')) return createdAtDate.getFullYear() === now.getFullYear();
      return true; // "All"
    });
  };
  const filteredSubscribers = filterByDate(safeSubscribers, visitsFilter);
  const filteredContacts = filterByDate(safeContacts, commentsFilter);
  const filteredRecent = filterByDate(safeContacts, recentFilter);

  return (
    <article className="dashboard">
      <div className="row">
        <div className="col-lg-8 col-md-12 col-sm-12 mb-2">
          <div className="row">
            {/* Subscribers card */}
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
                    {periods.map((period) => (
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
                    {t('dashboard.subscribers')} <span>| {visitsFilter}</span>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="ps-3">
                      <h6>{filteredSubscribers.length}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts card */}
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
                    {periods.map((period) => (
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
                    {t('contact')} <span>| {commentsFilter}</span>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="ps-3">
                      <h6>{filteredContacts.length}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently viewed contacts with Delete button */}
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
                    {periods.map((period) => (
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
                    {t('dashboard.contact')} <span>| {recentFilter}</span>
                  </h5>
                  <table className="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">{t('dashboard.name')}</th>
                        <th scope="col">{t('dashboard.email')}</th>
                        <th scope="col">{t('dashboard.message')}</th>
                        <th scope="col">{t('dashboard.date')}</th>
                        <th scope="col">{t('dashboard.time')}</th>
                        <th scope="col">{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecent.map((contact, index) => {
                        const createdAtDate = contact.createdAt?.toDate ? contact.createdAt.toDate() : null;

                        const formattedDate = createdAtDate
                          ? createdAtDate.toLocaleDateString(i18n.language, {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                          : t('acceuilPage.unknownDate');

                        const formattedTime = createdAtDate
                          ? createdAtDate.toLocaleTimeString(i18n.language, {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : '';

                        return (
                          <tr key={index}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.message}</td>
                            <td>{formattedDate}</td>
                            <td>{formattedTime}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => { handleDeleteClick(contact.id)}}
                              >
                                {t('dashboard.delete', 'Delete')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-lg-4 col-md-8 col-sm-12 d-none d-lg-block">
          <Notifications />
        </div>
      </div>
      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        message={ t(
          'dashboard.confirmDeleteContact'
        )}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </article>
  );
};

export default Dashboard;
