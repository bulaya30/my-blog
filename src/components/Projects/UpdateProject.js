import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { checkImage, checkName, checkURL, checkString } from '../../validation/validate';
import { updateProject } from '../store/actions/ProjectModel';
import { useTranslation } from 'react-i18next';

const UpdateProject = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const project = useSelector((state) =>
    Array.isArray(state.project.projects)
      ? state.project.projects.find((b) => b.id === id)
      : state.project.projects?.id === id
      ? state.project.projects
      : null
  );

  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    tools: "",
    link: "",
    photo: ""
  });

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id || "",
        title: project.title || "",
        description: project.description || "",
        tools: Array.isArray(project.tools) ? project.tools.join(", ") : "",
        link: project.link || "",
        photo: project.photo || ""
      });
    }
  }, [project]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 8000);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = t("updateProjectPage.errors.requiredTitle");
    else if (!checkName(formData.title.trim())) newErrors.title = t("updateProjectPage.errors.invalidTitle");

    if (!formData.description.trim()) newErrors.description = t("updateProjectPage.errors.requiredDescription");
    else if (!checkString(formData.description.trim())) newErrors.description = t("updateProjectPage.errors.invalidDescription");

    if (!formData.tools.trim()) newErrors.tools = t("updateProjectPage.errors.requiredTools");
    else if (!checkString(formData.tools.trim())) newErrors.tools = t("updateProjectPage.errors.invalidTools");

    if (!formData.link.trim()) newErrors.link = t("updateProjectPage.errors.requiredLink");
    else if (!checkURL(formData.link.trim())) newErrors.link = t("updateProjectPage.errors.invalidLink");

    if (formData.photo) {
      if (typeof formData.photo === "string" && !checkImage(formData.photo.trim())) newErrors.photo = t("updateProjectPage.errors.invalidPhoto");
      if (formData.photo instanceof File && !formData.photo.type.startsWith("image/")) newErrors.photo = t("updateProjectPage.errors.invalidPhoto");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return showToast(t("updateProjectPage.fixErrors"), "error");

    setLoading(true);
    try {
      const newProject = {
        ...formData,
        tools: formData.tools.split(",").map((t) => t.trim()),
        authorId: user.uid,
      };

      const result = await dispatch(updateProject(newProject));
      if (!result.error) showToast(t("updateProjectPage.success"), "success");
      else showToast(result.error || t("updateProjectPage.errors.invalidLink"), "error");
    } catch (err) {
      showToast(err.message || t("updateProjectPage.errors.invalidLink"), "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;
  const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div id="main">
      <div className='container'>
        <div className='row'>
          <div className='card border-0 shadow-sm col-lg-7 col-md-7 col-sm-12 justify-content-center align-items-center m-auto'>
            <div className="form-section">
              <div className='card-body'>
                <form id="project-edit-form" className='update-form' autoComplete="off" encType="multipart/form-data" onSubmit={handleSubmit}>
                  
                  {/* Project Image */}
                  <div className="row mb-3">
                    <label htmlFor="projectImage" className="col-md-4 col-lg-3 col-form-label">{t("updateProjectPage.photo")}</label>
                    <div className="col-md-8 col-lg-9 col-sm-12">
                      <img
                        src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo || "logo.png"}
                        alt="Project"
                        className="img-preview"
                      />
                      <div className={`input-box ${errorClass('photo')}`}>
                        <input
                          accept="image/*"
                          type="file"
                          id="file"
                          name="file"
                          onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                        />
                        <label htmlFor="file" className="btn btn-primary btn-sm text-white mt-3" title={t("updateProjectPage.photo")}>
                          <i className="bi bi-upload"></i>
                        </label>
                        {errors.photo && <p className="input-error">{errors.photo}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Text inputs */}
                  {['title', 'description', 'tools', 'link'].map(field => (
                    <div className={`input-box ${errorClass(field)}`} key={field}>
                      {field === 'description' ? (
                        <>
                          <textarea
                            id={field}
                            required
                            rows={4}
                            value={formData[field] || ""}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          />
                          <label htmlFor={field}>{t(`updateProjectPage.${field}`)}</label>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            id={field}
                            required
                            value={formData[field] || ""}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          />
                          <label htmlFor={field}>{t(`updateProjectPage.${field}`)}</label>
                        </>
                      )}
                      {errors[field] && <p className="input-error">{errors[field]}</p>}
                    </div>
                  ))}

                  <div className="input-box">
                    {!loading ? (
                      <button className="btn btn-sm w-50" type="submit">{t("updateProjectPage.saveChanges")}</button>
                    ) : (
                      <button className="btn btn-sm w-50" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span> {t("updateProjectPage.saving")}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
              
              {toast.message && (
                <div className={`toast-notification ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded mt-3`}>
                  {toast.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
