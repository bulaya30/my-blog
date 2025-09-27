import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { addBlog } from '../store/actions/BlogModel';
import { getCategory } from '../store/actions/categoryModel';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import { checkName, checkString } from '../../validation/validate';

const CreateBlog = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.category.categories);
  const { t } = useTranslation();

  const [title_en, setTitle_en] = useState('');
  const [title_fr, setTitle_fr] = useState('');
  const [content_en, setContent_en] = useState('');
  const [content_fr, setContent_fr] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  const validateBlog = () => {
    const newErrors = {};

    if (!title_en.trim()) newErrors.title_en = t('createBlogPage.titleRequired');
    else if (!checkName(title_en.trim())) newErrors.title_en = t('createBlogPage.invalidTitle');

    if (!title_fr.trim()) newErrors.title_fr = t('createBlogPage.titleRequired');
    else if (!checkName(title_fr.trim())) newErrors.title_fr = t('createBlogPage.invalidTitle');

    if (!content_en.replace(/<[^>]+>/g, '').trim()) newErrors.content_en = t('createBlogPage.contentRequired');
    else if (!checkString(content_en.replace(/<[^>]+>/g, '').trim())) newErrors.content_en = t('createBlogPage.invalidContent');

    if (!content_fr.replace(/<[^>]+>/g, '').trim()) newErrors.content_fr = t('createBlogPage.contentRequired');
    else if (!checkString(content_fr.replace(/<[^>]+>/g, '').trim())) newErrors.content_fr = t('createBlogPage.invalidContent');

    if (!category.trim()) newErrors.category = t('createBlogPage.categoryRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    dispatch(getCategory);
  }, [dispatch]);

  const safeCategories = Array.isArray(categories)
    ? categories
    : categories
    ? [categories]
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth) return showToast(t('createBlogPage.userNotLoaded'), 'error');
    if (!validateBlog()) return showToast(t('createBlogPage.fixErrors'), 'error');

    setLoading(true);
    const blogData = {
      title: { en: title_en.trim(), fr: title_fr.trim() },
      content: { en: content_en.trim(), fr: content_fr.trim() },
      category: category.trim(),
      authorId: auth.uid,
    };

    try {
      const result = await dispatch(addBlog(blogData));
      if (result?.success) {
        showToast(t('createBlogPage.blogAddedSuccess'), 'success');
        setTitle_en('');
        setTitle_fr('');
        setContent_en('');
        setContent_fr('');
        setCategory('');
        setErrors({});
      } else {
        showToast(result?.error || t('createBlogPage.blogAddFailed'), 'error');
      }
    } catch (err) {
      showToast(err.message || t('createBlogPage.blogAddFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quill Fonts & Sizes
  const Font = Quill.import('formats/font');
  Font.whitelist = ['arial', 'roboto', 'raleway', 'montserrat', 'lato', 'rubik'];
  Quill.register(Font, true);

  const Size = Quill.import('attributors/style/size');
  Size.whitelist = [
    '9px','10px','11px','12px','14px','16px','18px','20px','22px','24px','26px','28px'
  ];

  const modules = {
    toolbar: [
      [{ font: [] }, { size: Size.whitelist }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }, { direction: 'rtl' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ]
  };

  const formats = [
    'font','size','header',
    'bold','italic','underline','strike','blockquote',
    'color','background',
    'script','list','bullet','check','indent',
    'direction','align',
    'link','image','video','formula'
  ];

  if (!auth) return <Navigate to="/login" replace />;

  const errorClass = (field) => (errors[field] ? 'input-error-border' : '');

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>{t('createBlogPage.newBlog')}</h2>
        <div className="card-body">
          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Title English */}
            <div className={`input-box ${errorClass('title_en')}`}>
              <input
                type="text"
                value={title_en}
                onChange={(e) => setTitle_en(e.target.value)}
                disabled={loading}
              />
              <label>{t('createBlogPage.titleEn')}</label>
              {errors.title_en && <p className="input-error">{errors.title_en}</p>}
            </div>

            {/* Title French */}
            <div className={`input-box ${errorClass('title_fr')}`}>
              <input
                type="text"
                value={title_fr}
                onChange={(e) => setTitle_fr(e.target.value)}
                disabled={loading}
              />
              <label>{t('createBlogPage.titleFr')}</label>
              {errors.title_fr && <p className="input-error">{errors.title_fr}</p>}
            </div>

            {/* Category */}
            <div className={`input-box ${errorClass('category')}`}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
                <option value="">{t('createBlogPage.category')}</option>
                {safeCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="input-error">{errors.category}</p>}
            </div>

            {/* Content English */}
            <div className="input-box my-3">
              <p>{t('createBlogPage.contentEn')}</p>
              <div className="quill-wrapper">
                <ReactQuill
                  theme="snow"
                  value={content_en}
                  onChange={setContent_en}
                  modules={modules}
                  formats={formats}
                  readOnly={loading}
                />
              </div>
              {errors.content_en && <p className="input-error">{errors.content_en}</p>}
            </div>

            {/* Content French */}
            <div className="input-box my-3">
              <p>{t('createBlogPage.contentFr')}</p>
              <div className="quill-wrapper">
                <ReactQuill
                  theme="snow"
                  value={content_fr}
                  onChange={setContent_fr}
                  modules={modules}
                  formats={formats}
                  readOnly={loading}
                />
              </div>
              {errors.content_fr && <p className="input-error">{errors.content_fr}</p>}
            </div>

            {/* Submit */}
            <div className="input-box">
              {!loading ? (
                <button className="btn btn-sm w-100" type="submit">
                  {t('createBlogPage.publish')}
                </button>
              ) : (
                <button className="btn btn-sm w-100" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span> {t('createBlogPage.publishing')}</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Toast */}
        {toast.message && (
          <div
            className={`toast-notification ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            } text-white p-3 rounded mt-3`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
