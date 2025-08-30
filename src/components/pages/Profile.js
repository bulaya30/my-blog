import React, { useEffect } from 'react';
import { Link, Navigate, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Blog from '../blog/List';
import Dashboard from '../pages/Dashboard';
import Account from '../pages/UserAccount';
import CreateCategory from '../category/Create';
import CreateBlog from '../blog/Create';
import { getCategory, deleteCategory } from '../store/actions/categoryModel';

const Profile = ({ auth, categories, getCategory, deleteCategory }) => {
    useEffect(() => {
      getCategory();
    }, [getCategory]);
  // Redirect if not authenticated
  if (!auth) return <Navigate to="/login" replace />;


  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  const safeCategories = Array.isArray(categories)
    ? categories
    : categories
      ? [categories]  // single object case
      : [];           // null/undefined case

  if (safeCategories.length === 0) {
    return (
      <div className="home-category-container">
        <h2>Categories</h2>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div id="main-profile-content">
      <aside id="sidebar" className="sidebar">
        <ul id="sidebar-nav" className="sidebar-nav nav flex-column nav-tabs">
          <li className="nav-item">
            <Link to="/profile" className="nav-link active" data-bs-toggle="tab" data-bs-target="#dashboard">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#blogs">
              <i className="bi bi-card-list"></i>
              <span>Blogs</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#new-blog">
              <i className="bi bi-plus-circle"></i>
              <span>New Blog</span>
            </Link>
          </li>
          <li className="nav-heading">Account</li>
          <li className="nav-item">
            <Link to="#" className="nav-link collapsed" data-bs-toggle="tab" data-bs-target="#profile">
              <i className="bi bi-person"></i>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </aside>

      <section id="page-content">
        <div className="container">
          <div className="tab-content">
            <div className="tab-pane tabContents fade show active" id="dashboard" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">Profile</Link></li>
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ol>
                </nav>
              </div>
              <Dashboard />
            </div>

            <div className="tab-pane tabContents fade" id="blogs" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">Profile</Link></li>
                    <li className="breadcrumb-item active">Blogs</li>
                  </ol>
                </nav>
              </div>
              <div className="row">
                <div className="col-4">
                  <div className="home-category-container category-content">
                    <h2>Categories</h2>
                    <ul>
                      {safeCategories.map(category => (
                        <li key={category.id || category.key || Math.random()}>
                          <i className="bx bx-chevron-right"></i>
                          <NavLink to={`/categories/${category.id}`}>{category.name}</NavLink>

                          {auth && (
                            <NavLink to={`/categories/${category.id}/edit`} className="edit-category text-right">
                              <i className="text-right bx bx-edit"></i>
                            </NavLink>
                          )}

                          {auth && (
                            <button
                              type="button"
                              className="delete-category"
                              onClick={() => handleDelete(category.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <i className="bx bx-trash"></i>
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-8">
                  <Blog />
                </div>
              </div>
            </div>

            <div className="tab-pane tabContents fade" id="new-blog" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">Profile</Link></li>
                    <li className="breadcrumb-item active">New Article</li>
                  </ol>
                </nav>
              </div>
              <div className="new-blog">
                <div className="row">
                  <div className="col-4"><CreateCategory /></div>
                  <div className="col-8"><CreateBlog /></div>
                </div>
              </div>
            </div>

            <div className="tab-pane tabContents fade" id="profile" role="tabpanel">
              <div className="pagetitle">
                <nav>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile">Profile</Link></li>
                    <li className="breadcrumb-item active">Profile</li>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth.user,
  categories: state.category.categories,
});

const mapDispatchToProps = {
  getCategory,
  deleteCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
