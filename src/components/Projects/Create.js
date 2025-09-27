import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../store/actions/ProjectModel";
import { checkName, checkString, checkURL } from '../../validation/validate';
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateProject = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const [project, setProject] = useState({
        title: "",
        description: "",
        tools: "",
        link: "",
        photo: ""
    });

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 10000);
    };

    // ----- Validation rules -----
    const validate = () => {
        const newErrors = {};
        if (!project.title.trim()) newErrors.title = t('createProjectPage.validation.titleRequired');
        else if (!checkName(project.title.trim())) newErrors.title = t('createProjectPage.validation.titleInvalid');

        if (!project.description.trim()) newErrors.description = t('createProjectPage.validation.descriptionRequired');
        else if (!checkString(project.description.trim())) newErrors.description = t('createProjectPage.validation.descriptionInvalid');

        if (!project.tools.trim()) newErrors.tools = t('createProjectPage.validation.toolsRequired');
        else if (!checkString(project.tools.trim())) newErrors.tools = t('createProjectPage.validation.toolsInvalid');

        if (!project.link.trim()) newErrors.link = t('createProjectPage.validation.linkRequired');
        else if (!checkURL(project.link.trim())) newErrors.link = t('createProjectPage.validation.linkInvalid');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast(t('createProjectPage.validation.loginRequired'), 'error');
            return;
        }

        if (!validate()) return showToast(t('createProjectPage.validation.fixErrors'), 'error');

        setLoading(true);
        const newProject = {
            ...project,
            tools: project.tools.split(",").map((t) => t.trim()), // store tools as array
            authorId: user.uid,
        };
        try {
            const result = await dispatch(addProject(newProject));
            if (result.success) {
                showToast(t('createProjectPage.success'), 'success');
                setProject({ title: "", description: "", tools: "", link: "", photo: "" });
            } else {
                showToast(result.error || t('createProjectPage.error'), 'error');
            }
        } catch (err) {
            showToast(err.message || t('createProjectPage.error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <Navigate to="/login" replace />;
    const errorClass = (field) => (errors[field] ? "input-error-border" : "");

    return (
        <div className="form-section">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-7 col-md-7 col-sm-12">
                    <div className="card border-0 shadow-sm">
                        <h2>{t('createProjectPage.addTitle')}</h2>
                        <form className="edit-form" onSubmit={handleSubmit} autoComplete="off">
                            {/* Project Image */}
                            <div className="row mb-3">
                                <label htmlFor="projectImage" className="col-md-4 col-lg-3 col-form-label">
                                    {t('createProjectPage.projectImage')}
                                </label>
                                <div className="col-md-8 col-lg-9 col-sm-12">
                                    {project.photo && (
                                        <img
                                            src={project.photo instanceof File ? URL.createObjectURL(project.photo) : project.photo}
                                            alt="Project"
                                            className="img-preview"
                                        />
                                    )}
                                    <div className="pt-2 mb-3">
                                        <div className={`input-box ${errorClass('photo')}`}>
                                            <input
                                                accept="image/*"
                                                type="file"
                                                id="project-photo"
                                                name="file"
                                                onChange={(e) => setProject({ ...project, photo: e.target.files[0] })}
                                            />
                                            <label htmlFor="project-photo" className="btn btn-primary btn-sm text-white mt-3 ms-5" title={t('createProjectPage.uploadImage')}>
                                                <i className="bi bi-upload"></i>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`input-box ${errorClass('title')}`}>
                                <input
                                    type="text"
                                    name="title"
                                    value={project.title}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="form-label">{t('createProjectPage.title')}</label>
                                {errors.title && <p className="input-error">{errors.title}</p>}
                            </div>

                            <div className={`input-box ${errorClass('description')}`}>
                                <textarea
                                    name="description"
                                    value={project.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />
                                <label className="form-label">{t('createProjectPage.description')}</label>
                                {errors.description && <p className="input-error">{errors.description}</p>}
                            </div>

                            <div className={`input-box ${errorClass('tools')}`}>
                                <input
                                    type="text"
                                    name="tools"
                                    value={project.tools}
                                    onChange={handleChange}
                                    placeholder={t('createProjectPage.toolsPlaceholder')}
                                />
                                <label className="form-label">{t('createProjectPage.tools')}</label>
                                {errors.tools && <p className="input-error">{errors.tools}</p>}
                            </div>

                            <div className={`input-box ${errorClass('link')}`}>
                                <input
                                    type="url"
                                    name="link"
                                    value={project.link}
                                    onChange={handleChange}
                                />
                                <label className="form-label">{t('createProjectPage.link')}</label>
                                {errors.link && <p className="input-error">{errors.link}</p>}
                            </div>

                            <div className="input-box">
                                {!loading ? (
                                    <button className="btn btn-sm w-100" type="submit">
                                        {t('createProjectPage.addProject')}
                                    </button>
                                ) : (
                                    <button className="btn btn-sm w-100" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span> {t('createProjectPage.adding')}</span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Toast Notification */}
                {toast.message && (
                    <div
                        className={`toast-notification ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded mt-3`}
                        role="alert"
                    >
                        {toast.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateProject;
