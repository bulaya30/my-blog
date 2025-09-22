import React, { useEffect, useState } from 'react';
import { Link, NavLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Blog from '../blog/List';
import Dashboard from '../pages/Dashboard';
import Account from '../pages/UserAccount';
import Subscribers from './Subscribers';
import CreateCategory from '../category/Create';
import CreateBlog from '../blog/Create';
import { getCategory, deleteCategory } from '../store/actions/categoryModel';
import { useSidebar } from '../context/sidebarContext';
import ConfirmModal from '../models/confirmModel';
import { useTranslation } from 'react-i18next';
import CreateProject from '../Projects/Create';
import NotificationDetails from '../Notification/NotificationDetails';

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth.user);
  const admin = useSelector(state => state.auth.isAdmin);
  const categories = useSelector(state => state.category.categories);
  const { sidebarOpen, closeSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedCategory(id);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (selectedCategory) {
      await dispatch(deleteCategory(selectedCategory));
      setShowModal(false);
      setSelectedCategory(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  if (!auth) return <Navigate to="/login" replace />;

  const safeCategories = Array.isArray(categories)
    ? categories
    : categories
    ? [categories]
    : [];

  return (
    <div className="profile-page d-flex">
      {/* Sidebar */}
      <aside id="sidebar" className={sidebarOpen ? "open" : ""}>
        <button className="close-btn d-md-none" onClick={closeSidebar}>
          <i className="bx bx-x"></i>
        </button>
        <ul id="sidebar-nav" className="sidebar-nav nav flex-column nav-tabs">
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="bi bi-grid"></i><span>{t('profilePage.sidebar.dashboard')}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <i className="bi bi-bell"></i><span>{t('profilePage.sidebar.notifications')}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "blogs" ? "active" : ""}`}
              onClick={() => setActiveTab("blogs")}
            >
              <i className="bi bi-card-list"></i><span>{t('profilePage.sidebar.blogs')}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "new-blog" ? "active" : ""}`}
              onClick={() => setActiveTab("new-blog")}
            >
              <i className="bi bi-plus-circle"></i><span>{t('profilePage.sidebar.newBlog')}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("dataProject")}
            >
              <i className="bi bi-plus-circle"></i><span>{t('profilePage.sidebar.projects')}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "subscribers" ? "active" : ""}`}
              onClick={() => setActiveTab("subscribers")}
            >
              <i className="bi bi-people"></i><span>{t('profilePage.sidebar.subscribers')}</span>
            </Link>
          </li>
          <li className="nav-heading">{t('profilePage.sidebar.accountHeading')}</li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="bi bi-person"></i><span>{t('profilePage.sidebar.profile')}</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Page Content */}
      <section id="page-content" className="flex-grow-1 m-0">
        <div className="container-fluid">
          <div className="tab-content">
            {/* Dashboard */}
            <div className={`tab-pane tabContents fade ${activeTab === "dashboard" ? "show active" : ""}`} id="dashboard" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.dashboard')}</li>
                  </ol>
                </nav>
              </div>
              <Dashboard />
            </div>

            {/* Notifications */}
            <div className={`tab-pane tabContents fade ${activeTab === "notifications" ? "show active" : ""}`} id="blogs" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.notifications')}</li>
                  </ol>
                </nav>
              </div>
              <div className="row">                
                <div className="col-12 shadow-sm">
                  <NotificationDetails />
                </div>
              </div>
            </div>
            {/* Blogs */}
            <div className={`tab-pane tabContents fade ${activeTab === "blogs" ? "show active" : ""}`} id="blogs" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.blogs')}</li>
                  </ol>
                </nav>
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-12 mb-3 shadow-sm">
                  <div className="home-category-container category-content">
                    <h2>{t('profilePage.categories.title')}</h2>
                    {safeCategories.length === 0 ? (
                      <p>{t('profilePage.categories.loading')}</p>
                    ) : (
                      <ul>
                        {safeCategories.map(category => (
                          <li key={category.id}>
                            <i className="bx bx-chevron-right"></i>
                            <NavLink to={`/categories/${category.id}`}>{category.name}</NavLink>
                            {admin && (
                              <>
                                <NavLink to={`/categories/${category.id}/edit`} className="edit-category text-right">
                                  <i className="text-right bx bx-edit"></i>
                                </NavLink>
                                <button
                                  type="button"
                                  className="delete-category"
                                  onClick={() => handleDeleteClick(category.id)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                  <i className="bx bx-trash"></i>
                                </button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="col-sm-12 col-lg-8 shadow-sm">
                  <Blog />
                </div>
              </div>
            </div>

            {/* New Blog */}
            <div className={`tab-pane tabContents fade ${activeTab === "new-blog" ? "show active" : ""}`} id="new-blog" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.newArticle')}</li>
                  </ol>
                </nav>
              </div>
              <div className="row">
                {admin ? (
                  <>
                    <div className="col-12 col-lg-4"><CreateCategory /></div>
                    <div className="col-12 col-lg-8"><CreateBlog /></div>
                  </>
                ) : (
                  <div className="col-12"><CreateBlog /></div>
                )}
              </div>
            </div>

            {/* Projects Profile */}
            <div className={`tab-pane tabContents fade ${activeTab === "dataProject" ? "show active" : ""}`} id="profile" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.projects')}</li>
                  </ol>
                </nav>
              </div>
              <section className="section profile">
                <CreateProject />
              </section>
            </div>

            {/* Subscribers Profile */}
            <div className={`tab-pane tabContents fade ${activeTab === "subscribers" ? "show active" : ""}`} id="profile" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.subscribers')}</li>
                  </ol>
                </nav>
              </div>
              <section className="section profile">
                <Subscribers />
              </section>
            </div>
            {/* Account Profile */}
            <div className={`tab-pane tabContents fade ${activeTab === "profile" ? "show active" : ""}`} id="profile" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">{t('profilePage.breadcrumb.profile')}</Link></li>
                    <li className="breadcrumb-item active">{t('profilePage.breadcrumb.profile')}</li>
                  </ol>
                </nav>
              </div>
              <section className="section profile">
                <Account />
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        message={t('profilePage.confirm.deleteCategory')}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Profile;
