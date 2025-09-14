import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribers, deleteSubscribers } from "../store/actions/SubscriberModel";
import ConfirmModal from "../models/confirmModel";
import { useTranslation } from "react-i18next";

const Subscribers = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const subscribersFromState = useSelector((state) => state.subscriber.subscribers);
  const loading = useSelector((state) => state.subscriber.loading);

  // Ensure subscribers is always an array
  const subscribers = Array.isArray(subscribersFromState)
    ? subscribersFromState
    : subscribersFromState
    ? [subscribersFromState]
    : [];

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const [filter, setFilter] = useState("All"); // default show all
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch subscribers on mount
  useEffect(() => {
    dispatch(getSubscribers());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (subscriber) => {
    setSelected(subscriber);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selected) {
      try {
        const result = await dispatch(deleteSubscribers(selected.id));
        if (result?.success) {
          showToast(t("subscriberDeleted"), "success");
        } else {
          showToast(t("subscriberDeleteFailed"), "error");
        }
      } catch (err) {
        showToast(t("subscriberDeleteFailed"), "error");
      }
    }
    setShowModal(false);
    setSelected(null);
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  const handleFilterChange = (period) => {
    setFilter(period);
    setDropdownOpen(false);
  };

  // Apply filter only if not "All"
  const filteredSubscribers =
    filter === "All"
      ? subscribers
      : subscribers.filter((sub) => {
          if (!sub.createdAt) return false;
          const createdAt = new Date(sub.createdAt.seconds * 1000);
          const now = new Date();

          if (filter === "Today") return createdAt.toDateString() === now.toDateString();
          if (filter === "This Month")
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );
          if (filter === "This Year") return createdAt.getFullYear() === now.getFullYear();
          return true;
        });

  return (
    <div className="row p-3">
      <div className="col-12">
        <div className="card recent-view overflow-auto mt-3 info-card position-relative">
          {/* Filter Dropdown */}
          <div className="filter position-absolute" ref={dropdownRef} style={{ top: "15px", right: "15px" }}>
            <button className="icon btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <i className="bi bi-three-dots"></i>
            </button>
            {dropdownOpen && (
              <ul
                className="dropdown-menu dropdown-menu-end dropdown-menu-arrow show"
                style={{
                  position: "absolute",
                  right: 0,
                  left: "auto",
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  zIndex: 1050, // stays on top
                }}
              >
                <li className="dropdown-header text-start">
                  <h6>{t("filter")}</h6>
                </li>
                {["All", "Today", "This Month", "This Year"].map((period) => (
                  <li key={period}>
                    <button
                      className={`dropdown-item ${filter === period ? "active" : ""}`}
                      onClick={() => handleFilterChange(period)}
                    >
                      {t(period)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card-body">
            <h5 className="card-title">
              {t("subscribers")} <span>| {filter}</span>
            </h5>

            {loading ? (
              <p>{t("loading")}</p>
            ) : filteredSubscribers.length === 0 ? (
              <p>{t("noSubscribers")}</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-borderless datatable">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t("email")}</th>
                      <th>{t("dateSubscribed")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub, index) => (
                      <tr key={sub.id || index}>
                        <td>{index + 1}</td>
                        <td>{sub.email}</td>
                        <td>
                          {sub.createdAt
                            ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(sub)}
                          >
                            {t("delete")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showModal}
        message={t("confirmDeleteSubscriber")}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`toast-notification ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white p-3 rounded mt-3`}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Subscribers;
