import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCategory, deleteCategory } from '../store/actions/categoryModel';
import { useTranslation } from 'react-i18next';

const Category = ({ categories, getCategory, auth, deleteCategory }) => {
  const { t } = useTranslation();

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories)
    ? categories
    : categories
    ? [categories] // single object case
    : []; // null/undefined case

  if (safeCategories.length === 0) {
    return (
      <div className="home-category-container">
        <h2>{t('categoryPage.title')}</h2>
        <p>{t('categoryPage.loading')}</p>
      </div>
    );
  }

  return (
    <div className="home-category-container category-content">
      <h2>{t('categoryPage.title')}</h2>
      <ul>
        {safeCategories.map((category) => (
          <li key={category.id || category.key || Math.random()}>
            <i className="bx bx-chevron-right"></i>
            <NavLink to={`/categories/${category.id}`}>{category.name}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    categories: state.category.categories || [],
    auth: state.auth.user?.profile || null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCategory: (id) => dispatch(deleteCategory(id)),
    getCategory: () => dispatch(getCategory()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
