import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../store/actions/DataAnalysisModel";
import { checkName, checkString, checkURL } from '../../validation/validate';
import { Navigate } from "react-router-dom";

const CreateProject = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const [project, setProject] = useState({
        title: "",
        description: "",
        tools: "",
        link: ""
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
        if (!project.title.trim()) newErrors.title = "Project Title is required.";
        if (!checkName(project.title.trim())) newErrors.title = "Invalid Project title.";
        if (!project.description.trim()) newErrors.description = "Project Description is required.";
        if (!checkString(project.description.trim())) newErrors.description = "Invalid Project title.";
        if (!project.tools.trim()) newErrors.tools = "Project Tools is required.";
        if (!checkString(project.tools.trim())) newErrors.tools = "Invalid Tools.";
        if (!project.link.trim()) newErrors.link = "Project link is required.";
        if (!checkURL(project.link.trim())) newErrors.link = "Invalid link .";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
        }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast('You must be logged in to add a project!', 'error');
        return;
        }
        if (!validate()) return showToast("Please fix the errors before submitting.", 'error');

        setLoading(true);
        const newProject = {
        ...project,
        tools: project.tools.split(",").map((t) => t.trim()), // store tools as array
        authorId: user.uid,
        };
        try{
            const result = await dispatch(addProject(newProject));
            if (result.success) {
            showToast('Project added successfully!', 'success');
            setProject({ title: "", description: "", tools: "", link: "" });
            } else {
            alert(result.error);
            showToast(result.error, 'error');
            }
        } catch (err) {
        showToast('An error occurred', 'error');
        } finally {
        setLoading(false);
        }
    };
    if(!user) return <Navigate to="/" replace />;
    const errorClass = (field) => (errors[field] ? "input-error-border" : "");

  return (
    <div className="form-section">
        <div className="row align-items-center justify-content-center">
            <div className="col-lg-7 col-md-7 col-sm-12">

                <div className="card border-0 shadow-sm">
                    <h2>Add Data Analysis Project</h2>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className={`input-box ${errorClass('title')}`}>
                        <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            required
                        />          
                        <label className="form-label">Project Title</label>
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
                        <label className="form-label">Description</label>
                        {errors.description && <p className="input-error">{errors.description}</p>}
                        </div>

                        <div className={`input-box ${errorClass('tools')}`}>
                        <input
                            type="text"
                            name="tools"
                            value={project.tools}
                            onChange={handleChange}
                            placeholder="Python, Pandas, Matplotlib"
                        />
                        <label className="form-label">Tools Used (comma separated)</label>
                        {errors.tools && <p className="input-error">{errors.tools}</p>}
                        </div>

                        <div className={`input-box ${errorClass('link')}`}>
                        <input
                            type="url"
                            name="link"
                            value={project.link}
                            onChange={handleChange}
                        />
                        <label className="form-label">Project Link (GitHub, Notebook, etc.)</label>
                        {errors.link && <p className="input-error">{errors.link}</p>}
                        </div>
                        <div className="input-box">
                            {!loading ? (
                                <button className="btn btn-sm w-100" type="submit">
                                Add Project
                                </button>
                            ) : (
                                <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span> Adding...</span>
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
