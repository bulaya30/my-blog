import React, { useEffect, useState } from "react";
import { useParams, NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProjects, deleteProject } from "../store/actions/ProjectModel";
import ConfirmModal from '../models/confirmModel';
import Footer from "../home/footer";

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.user);
  const admin = useSelector((state) => state.auth.isAdmin);
  const project = useSelector((state) =>
    Array.isArray(state.project.projects)
      ? state.project.projects.find((b) => b.id === id)
      : state.project.projects?.id === id
      ? state.project.projects
      : null
  );
  // Modal state
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(getProjects("id", id));
  }, [dispatch, id]);

  const handleDeleteClick = () => {
    setShowModal(true);
  };
  
    const handleCancel = () => {
      setShowModal(false);
    };

   const handleDelete = async () => {
    const result = await dispatch(deleteProject(id));
    setShowModal(false);
    if (result.success) {
      navigate('/projects');
    } else {
      alert("Delete failed: " + result.error);
    }
  };



  if (!project) {
    return (
      <div className="text-center py-5 my-5 fw-bold">
        {t("projectsPage.notFound")}
      </div>
    );
  }

  if (project.length === 0) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="project-details-page container pt-5 mt-5 bg-white">
        {/* <div className="container py-5"> */}
          {/* Title */}
          <section className=" mb-5">
            <h3 className="text-center fw-bold">{project.title}</h3>
            <img src={project.photo || "logo.png"} alt="" className="" />
            <section className="mb-4 project-description">
              <h4 className="text-center">{t("projectsPage.description")}</h4>
              <p className="lead ">{project.description}</p>
            </section>
          </section>
          <hr className="divider" />
          {/* Tools */}
          {project.tools && project.tools.length > 0 && (
            <section className="mb-4 project-tools">
              <h4>{t("projectsPage.tools")}</h4>
              <p>{project.tools.join(", ")}</p>
            </section>
          )}

          {/* Link */}
          {project.link && (
            <section className="mb-4 link-btn">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("projectsPage.viewProject")}
              </a>
            </section>
          )}
          {/* Show Edit/Delete buttons */}
              {auth && project.authorId === auth.uid ? (
                <>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handleDeleteClick}
                    title={t("deleteThisArticle")}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <Link
                    className="btn btn-primary mt-3 ms-2"
                    to={`/projects/${id}/edit`}
                    title={t("updateThisArticle")}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                </>
              ) : (
                admin && (
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handleDeleteClick}
                    title={t("deleteThisArticle")}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )
              )}
          {/* Author */}
          {project.authorName && (
            <section className="mt-5">
              <p className="text-muted">
                {t("projectsPage.addedBy")}: {project.authorName}
              </p>
            </section>
          )}

          {/* Collaborate CTA */}
          <section className=" pb-3 my-5 text-center">
            <h4 className="mb-3">{t("projectsPage.interested")}</h4>
            <NavLink to="/contact" className="btn hero-btn">
              {t("projectsPage.collaborateBtn")}
            </NavLink>
          </section>
        {/* </div> */}
         {/* Confirm Modal */}
              <ConfirmModal
                show={showModal}
                message={t('profilePage.confirm.deleteCategory')}
                onConfirm={handleDelete}
                onCancel={handleCancel}
              />
      </main>
      <Footer />
    </>
  );
};

export default ProjectDetails;
