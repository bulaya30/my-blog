import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCategory, deleteCategory } from '../store/actions/categoryModel';
import { useTranslation } from 'react-i18next';

const Category = ({ categories, getCategory}) => {
  const { t } = useTranslation();

  useEffect(() => {
    getCategory();
  }, [getCategory]);
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories)
  ? categories
  : categories
  ? [categories]
  : [];
  
  if (!categories) {
    return (
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <p>{t('categoryPage.noCategory')}</p>
      </div>
    );
  }

  if (safeCategories.length === 0) {
    return (
      <div className="text-start">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('categoryPage.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-category-container category-content">
      <h2>{t('categoryPage.title')}</h2>
      <ul>
        {safeCategories.map((category) => (
          <li key={category.id}>
            <i className="bx bx-chevron-right"></i>
            <NavLink to={`/categories/${category.id}`}>
              {category.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.category.categories || [],
  auth: state.auth.user?.profile || null,
});

const mapDispatchToProps = (dispatch) => ({
  deleteCategory: (id) => dispatch(deleteCategory(id)),
  getCategory: () => dispatch(getCategory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
