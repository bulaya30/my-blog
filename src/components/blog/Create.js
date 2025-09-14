import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog } from '../store/actions/BlogModel';
import { Editor } from '@tinymce/tinymce-react';
import { checkName, checkString } from '../../validation/validate';
import { useTranslation } from 'react-i18next';

const CreateBlog = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Blog fields
  const [title_en, setTitle_en] = useState('');
  const [title_fr, setTitle_fr] = useState('');
  const [content_en, setContent_en] = useState('');
  const [content_fr, setContent_fr] = useState('');
  const [category, setCategory] = useState('');

  // Inline errors
  const [errors, setErrors] = useState({});

  // ----- Toast helper -----
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 8000);
  };

  // ----- Validation rules -----
  const validateBlog = () => {
    const newErrors = {};

    if (!title_en.trim()) newErrors.title_en = t("createBlogPage.Title (English) is required.");
    else if (title_en.trim().length < 5) newErrors.title_en = t("createBlogPage.Title (English) must be at least 5 characters long.");
    else if (!checkName(title_en.trim())) newErrors.title_en = t("createBlogPage.Invalid name.");

    if (!title_fr.trim()) newErrors.title_fr = t("createBlogPage.Title (French) is required.");
    else if (title_fr.trim().length < 5) newErrors.title_fr = t("createBlogPage.Title (French) must be at least 5 characters long.");
    else if (!checkName(title_fr.trim())) newErrors.title_fr = t("createBlogPage.Invalid name.");

    if (!content_en.replace(/<[^>]+>/g, '').trim()) newErrors.content_en = t("createBlogPage.Content (English) is required.");
    else if (content_en.replace(/<[^>]+>/g, '').trim().length < 50) 
      newErrors.content_en = t("createBlogPage.Content (English) must be at least 50 characters long.");
    else if (!checkString(content_en.replace(/<[^>]+>/g, '').trim())) 
      newErrors.content_en = t("createBlogPage.Invalid content.");

    if (!content_fr.replace(/<[^>]+>/g, '').trim()) newErrors.content_fr = t("createBlogPage.Content (French) is required.");
    else if (content_fr.replace(/<[^>]+>/g, '').trim().length < 50) 
      newErrors.content_fr = t("createBlogPage.Content (French) must be at least 50 characters long.");
    else if (!checkString(content_fr.replace(/<[^>]+>/g, '').trim())) 
      newErrors.content_fr = t("createBlogPage.Invalid content.");

    if (!category.trim()) newErrors.category = t("createBlogPage.Category is required.");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth) return showToast(t("createBlogPage.User info not loaded. Please wait."));

    if (!validateBlog()) return showToast(t("createBlogPage.Please fix the errors before submitting."), "error");

    setLoading(true);

    const blogData = {
      title: { en: title_en.trim(), fr: title_fr.trim() },
      content: { en: content_en.trim(), fr: content_fr.trim() },
      category: category.trim(),
      authorId: auth.uid
    };

    try {
      const result = await dispatch(addBlog(blogData));
      if (result?.success) {
        showToast(t("createBlogPage.Blog added successfully!"), "success");

        // Reset form
        setTitle_en('');
        setTitle_fr('');
        setContent_en('');
        setContent_fr('');
        setCategory('');
        setErrors({});
      } else {
        showToast(result?.error || t("createBlogPage.Failed to add blog"), "error");
      }
    } catch (err) {
      showToast(err.message || t("createBlogPage.An error occurred"), "error");
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <p>{t("createBlogPage.Loading user info...")}</p>;

  // Helper to apply red border if field has an error
  const errorClass = (field) => errors[field] ? 'input-error-border' : '';

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>{t("createBlogPage.New Blog")}</h2>
        <div className="card-body">

          <form onSubmit={handleSubmit} id="new-blog-form" autoComplete="off">

            {/* Title English */}
            <div className={`input-box ${errorClass('title_en')}`}>
              <input
                type="text"
                name="title_en"
                value={title_en}
                required
                onChange={(e) => setTitle_en(e.target.value)}
              />
              <label htmlFor="title_en">{t("createBlogPage.Title (English)")}</label>
              {errors.title_en && <p className="input-error">{errors.title_en}</p>}
            </div>

            {/* Title French */}
            <div className={`input-box ${errorClass('title_fr')}`}>
              <input
                type="text"
                name="title_fr"
                value={title_fr}
                required
                onChange={(e) => setTitle_fr(e.target.value)}
              />
              <label htmlFor="title_fr">{t("createBlogPage.Title (French)")}</label>
              {errors.title_fr && <p className="input-error">{errors.title_fr}</p>}
            </div>

            {/* Category */}
            <div className={`input-box ${errorClass('category')}`}>
              <select
                name="category"
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=""></option>
                <option value="Mentorship and advice">{t("createBlogPage.Mentorship and advice")}</option>
                <option value="Tips">{t("createBlogPage.Tips")}</option>
                <option value="Business">{t("createBlogPage.Business")}</option>
              </select>
              <label htmlFor="category">{t("createBlogPage.Category")}</label>
              {errors.category && <p className="input-error">{errors.category}</p>}
            </div>

            {/* Content English */}
            <div className={`input-box my-4 ${errorClass('content_en')}`}>
              <p className="blog-content mb-3">{t("createBlogPage.Content (English)")}</p>
              <Editor
                apiKey='uw12u5jyw7fsvuxv9x7tp76nm2s5plzg8dqcwu60fz5jt28o'
                id="content_en"
                name="content_en"
                value={content_en}
                init={{
                  height: 300,
                  menubar: false,
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                    'link media table mergetags | addcomment showcomments | ' +
                    'spellcheckdialog a11ycheck typography uploadcare | align lineheight |' +
                    ' checklist numlist bullist indent outdent | emoticons charmap | ' +
                    'removeformat | code preview fullscreen',
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount',
                  ],
                }}
                onEditorChange={(newContent) => setContent_en(newContent)}
              />
              {errors.content_en && <p className="input-error">{errors.content_en}</p>}
            </div>

            {/* Content French */}
            <div className={`input-box my-4 ${errorClass('content_fr')}`}>
              <p className="blog-content mb-3">{t("createBlogPage.Content (French)")}</p>
              <Editor
                apiKey='uw12u5jyw7fsvuxv9x7tp76nm2s5plzg8dqcwu60fz5jt28o'
                id="content_fr"
                name="content_fr"
                value={content_fr}
                init={{
                  height: 300,
                  menubar: false,
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                    'link media table mergetags | addcomment showcomments | ' +
                    'spellcheckdialog a11ycheck typography uploadcare | align lineheight |' +
                    ' checklist numlist bullist indent outdent | emoticons charmap | ' +
                    'removeformat | code preview fullscreen',
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount',
                  ],
                }}
                onEditorChange={(newContent) => setContent_fr(newContent)}
              />
              {errors.content_fr && <p className="input-error">{errors.content_fr}</p>}
            </div>

            {/* Submit */}
            <div className="input-box mt-3">
              <button
                className="btn btn-sm w-100"
                name="submit"
                type="submit"
                style={{ display: loading ? 'none' : 'block' }}
              >
                {t("createBlogPage.Publish")}
              </button>
              <button
                className="btn btn-sm w-100 loading-btn"
                type="button"
                disabled
                style={{ display: loading ? 'block' : 'none' }}
              >
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>{t("createBlogPage.Publishing...")}</span>
              </button>
            </div>

          </form>
        </div>
        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`toast-notification ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white p-3 rounded mt-3`}
              role="alert"
            >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
