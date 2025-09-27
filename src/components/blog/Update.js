import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill, { Quill } from 'react-quill-new';
import { getBlog, updateBlog } from '../store/actions/BlogModel';
import { getCategory } from '../store/actions/categoryModel';
import { checkName, checkString } from '../../validation/validate';
import { useTranslation } from 'react-i18next';

const UpdateBlog = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.user);
  const blog = useSelector((state) =>
    Array.isArray(state.blog.blogs)
      ? state.blog.blogs.find((b) => b.id === id)
      : state.blog.blogs?.id === id
      ? state.blog.blogs
      : null
  );
  const category = useSelector((state) => state.category.categories || []);

  const [title_en, setTitle_en] = useState('');
  const [title_fr, setTitle_fr] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [content_en, setContent_en] = useState('');
  const [content_fr, setContent_fr] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    dispatch(getBlog('id', id));
    dispatch(getCategory());
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      setTitle_en(blog.title.en);
      setTitle_fr(blog.title.fr);
      setCategoryValue(blog.category);
      setContent_en(blog.content.en);
      setContent_fr(blog.content.fr);
    }
  }, [blog]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  const validateBlog = () => {
    const newErrors = {};

    if (!title_en.trim()) newErrors.title_en = t("updateBlogPage.titleEnRequired");
    else if (title_en.trim().length < 5) newErrors.title_en = t("updateBlogPage.titleEnLength");
    else if (!checkName(title_en.trim())) newErrors.title_en = t("updateBlogPage.titleEnInvalid");

    if (!title_fr.trim()) newErrors.title_fr = t("updateBlogPage.titleFrRequired");
    else if (title_fr.trim().length < 5) newErrors.title_fr = t("updateBlogPage.titleFrLength");
    else if (!checkName(title_fr.trim())) newErrors.title_fr = t("updateBlogPage.titleFrInvalid");

    if (!content_en.replace(/<[^>]+>/g, '').trim()) newErrors.content_en = t("updateBlogPage.contentEnRequired");
    else if (content_en.replace(/<[^>]+>/g, '').trim().length < 50) newErrors.content_en = t("updateBlogPage.contentEnLength");
    else if (!checkString(content_en.replace(/<[^>]+>/g, '').trim())) newErrors.content_en = t("updateBlogPage.contentEnInvalid");

    if (!content_fr.replace(/<[^>]+>/g, '').trim()) newErrors.content_fr = t("updateBlogPage.contentFrRequired");
    else if (content_fr.replace(/<[^>]+>/g, '').trim().length < 50) newErrors.content_fr = t("updateBlogPage.contentFrLength");
    else if (!checkString(content_fr.replace(/<[^>]+>/g, '').trim())) newErrors.content_fr = t("updateBlogPage.contentFrInvalid");

    if (!categoryValue.trim()) newErrors.category = t("updateBlogPage.categoryRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth) return showToast(t("updateBlogPage.userNotLoaded"));

    if (!validateBlog()) return showToast(t("updateBlogPage.fixErrors"));

    setLoading(true);
    const updatedBlog = {
      title: { en: title_en.trim(), fr: title_fr.trim() },
      content: { en: content_en.trim(), fr: content_fr.trim() },
      category: categoryValue.trim(),
      authorId: auth.uid,
    };

    dispatch(updateBlog(id, updatedBlog))
      .then(() => {
        showToast(t("updateBlogPage.success"), "success");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  };

  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  // Quill Fonts & Sizes
  const Font = Quill.import('formats/font');
  Font.whitelist = ['arial', 'roboto', 'raleway', 'montserrat', 'lato', 'rubik'];
  Quill.register(Font, true);
  const Size = Quill.import('attributors/style/size');
  Size.whitelist = ['9px','10px','11px','12px','14px','16px','18px','20px','22px','24px','26px','28px'];
  Quill.register(Size, true);

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
    'font', 'size', 'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background', 'script', 'list', 'bullet', 'check', 'indent',
    'direction', 'align', 'link', 'image', 'video', 'formula'
  ];

  if (!auth) return <p>{t("loading")}</p>;
  if (!blog) return <p>{t("loadingBlog")}</p>;

  return (
    <div id="main">
      <div className="container">
        <div className="row">
          <div className="form-section">
            <div className="card mt-3 border-0 shadow-sm">
              <h2>{t("updateBlogPage.updateBlogTitle")}</h2>
              <div className="card-body">
                <form onSubmit={handleSubmit} id="update-blog-form" autoComplete="off">
                  {/* Title EN */}
                  <div className={`input-box ${errorClass('title_en')}`}>
                    <input type="text" name="title_en" required value={title_en} onChange={(e) => setTitle_en(e.target.value)} />
                    <label htmlFor="title_en">{t("updateBlogPage.titleEn")}</label>
                    {errors.title_en && <p className="input-error">{errors.title_en}</p>}
                  </div>

                  {/* Title FR */}
                  <div className={`input-box ${errorClass('title_fr')}`}>
                    <input type="text" name="title_fr" required value={title_fr} onChange={(e) => setTitle_fr(e.target.value)} />
                    <label htmlFor="title_fr">{t("updateBlogPage.titleFr")}</label>
                    {errors.title_fr && <p className="input-error">{errors.title_fr}</p>}
                  </div>

                  {/* Category */}
                  <div className={`input-box ${errorClass('category')}`}>
                    <select name="category" id="category" required value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)}>
                      {category.map((cat) => <option key={cat.id || cat} value={cat.name || cat}>{cat.name || cat}</option>)}
                    </select>
                    <label htmlFor="category">{t("updateBlogPage.category")}</label>
                    {errors.category && <p className="input-error">{errors.category}</p>}
                  </div>

                  {/* Content EN */}
                  <div className={`input-box my-4 ${errorClass('content_en')}`}>
                    <p>{t("updateBlogPage.contentEn")}</p>
                    <ReactQuill theme="snow" value={content_en} onChange={setContent_en} modules={modules} formats={formats} readOnly={loading} />
                    {errors.content_en && <p className="input-error">{errors.content_en}</p>}
                  </div>

                  {/* Content FR */}
                  <div className={`input-box my-4 ${errorClass('content_fr')}`}>
                    <p>{t("updateBlogPage.contentFr")}</p>
                    <ReactQuill theme="snow" value={content_fr} onChange={setContent_fr} modules={modules} formats={formats} readOnly={loading} />
                    {errors.content_fr && <p className="input-error">{errors.content_fr}</p>}
                  </div>

                  <div className="input-box">
                    {!loading ? (
                      <button className="btn btn-sm w-100" type="submit">{t("updateBlogPage.saveChanges")}</button>
                    ) : (
                      <button className="btn btn-sm w-100" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span> {t("updateBlogPage.saving")}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
              {toast.message && <div className={`toast-notification ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white p-3 rounded mt-3`} role="alert">{toast.message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;
