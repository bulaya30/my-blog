import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog } from '../store/actions/BlogModel';
import { Editor } from '@tinymce/tinymce-react';
import { useTranslation } from 'react-i18next';

const CreateBlog = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth.user);
  const { i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    // Determine the current language
    const currentLang = localStorage.getItem('lang') || 'en';
    const originalLang = currentLang; // author input language
    const targetLang = originalLang === 'en' ? 'fr' : 'en'; // translate to the other language

    const result = await dispatch(
      addBlog({
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        authorId: auth.uid,
        lang: originalLang, // pass original language to action if needed
        targetLang // the language to auto-translate
      })
    );

    setLoading(false);

    if (result?.success) {
      setToast({ message: 'Blog added successfully!', type: 'success' });
      setTimeout(() => setToast({ message: '', type: '' }), 5000);
      setTitle('');
      setCategory('');
      setContent('');
    } else {
      setToast({ message: result?.error || 'Failed to add blog', type: 'error' });
      setTimeout(() => setToast({ message: '', type: '' }), 5000);
    }
  };

  if (!auth) return <p>Loading user info...</p>;

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>{i18n.t('newBlog')}</h2>
        <div className="card-body">

          {toast.message && (
            <div
              className={`toast ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white p-3 rounded mb-4`}
            >
              {toast.message}
            </div>
          )}

          <form onSubmit={handleSubmit} id="new-blog-form" autoComplete="off">

            <div className="input-box">
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title">{i18n.t('title')}</label>
            </div>

            <div className="input-box">
              <select
                name="category"
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=""></option>
                <option value="Mentorship and advice">{i18n.t('mentorship')}</option>
                <option value="Tips">{i18n.t('tips')}</option>
                <option value="Business">{i18n.t('business')}</option>
              </select>
              <label htmlFor="category">{i18n.t('category')}</label>
            </div>

            <div className="input-box">
              <label htmlFor="content">{i18n.t('content')}</label>
              <Editor
                apiKey="uw12u5jyw7fsvuxv9x7tp76nm2s5plzg8dqcwu60fz5jt28o"
                id="content"
                value={content}
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
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 
                    'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                  ],
                  block_formats:
                    'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Code=code',
                }}
                onEditorChange={setContent}
              />
            </div>

            <div className="input-box">
              <button
                type="submit"
                className="btn btn-sm w-100"
                style={{ display: loading ? 'none' : 'block' }}
              >
                {i18n.t('publish')}
              </button>
              <button
                className="btn btn-sm w-100 loading-btn"
                type="button"
                disabled
                style={{ display: loading ? 'block' : 'none' }}
              >
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>{i18n.t('publishing')}...</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
