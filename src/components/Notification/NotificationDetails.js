import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getNotification, deleteNotification } from "../store/actions/NotificationsModel";
import { useTranslation } from "react-i18next";

const NotificationDetails = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const notifications = useSelector((state) => state.notification.notifications || []);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getNotification());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm(t("notifications.confirmDelete"))) {
      await dispatch(deleteNotification(id));
    }
  };

  // Group notifications by type
  const groupedNotifications = notifications.reduce((groups, note) => {
    const type = note.type || "other";
    if (!groups[type]) groups[type] = [];
    groups[type].push(note);
    return groups;
  }, {});

  const formatDate = (date) =>
    date?.toDate
    ? date.toDate().toLocaleString(i18n.language, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";


  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <div className="notifications-page container">
          <h2 className="text-center mb-2 p-3">{t("notificationPage.title")}</h2>

          {!notifications ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-center fw-bold">{t("notificationPage.none")}</p>
          ) : (
            Object.entries(groupedNotifications).map(([type, notes]) => (
              <div key={type} className="mb-4 bg-white shadow-sm p-3">
                <h4 className="mb-3 text-capitalize text-center fw-bold">
                  {t(`notifications.types.${type}`, type)} {'Notification'}
                </h4>
                <ul className="list-group">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <p className="mb-1">{note.message}</p>
                        <small className="text-muted">{formatDate(note.createdAt)}</small>
                      </div>
                      {isAdmin && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(note.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
      </div>
    </>
  );
};

export default NotificationDetails;
