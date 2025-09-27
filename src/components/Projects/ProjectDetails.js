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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.user);
  const admin = useSelector((state) => state.auth.isAdmin);
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  const project = useSelector((state) =>
    Array.isArray(state.project.projects)
      ? state.project.projects.find((b) => b.id === id)
      : state.project.projects?.id === id
      ? state.project.projects
      : null
  );

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getProjects("id", id));
  }, [dispatch, id]);

  const handleDeleteClick = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);
  const handleDelete = async () => {
    const result = await dispatch(deleteProject(id));
    setShowModal(false);
    if (result.success) navigate('/projects');
    else alert("Delete failed: " + result.error);
  };

  if (!project) {
    return <div className="text-center py-5 my-5 fw-bold">{t("projectsPage.notFound")}</div>;
  }

  return (
    <>
      <main className="project-details-page container pt-5 mt-5 bg-white">
        <section className="mb-5 text-center">
          <h3 className="fw-bold">{project.title[lang] || project.title}</h3>
          <img src={project.photo || "logo.png"} alt="" />
          <section className="mb-4 project-description">
            <h4>{t("projectsPage.description")}</h4>
            <p className="lead">{project.description[lang] || project.description}</p>
          </section>
        </section>

        <hr className="divider" />

        {project.tools?.length > 0 && (
          <section className="mb-4 project-tools">
            <h4>{t("projectsPage.tools")}</h4>
            <p>{project.tools.join(", ")}</p>
          </section>
        )}

        {project.link && (
          <section className="mb-4 link-btn">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              {t("projectsPage.viewProject")}
            </a>
          </section>
        )}

        {(auth && project.authorId === auth.uid) || admin ? (
          <div>
            <button
              className="btn btn-danger mt-3"
              onClick={handleDeleteClick}
              title={t("deleteThisArticle")}
            >
              <i className="bi bi-trash"></i>
            </button>
            {auth && project.authorId === auth.uid && (
              <Link
                className="btn btn-primary mt-3 ms-2"
                to={`/projects/${id}/edit`}
                title={t("updateThisArticle")}
              >
                <i className="bi bi-pencil-square"></i>
              </Link>
            )}
          </div>
        ) : null}

        {project.authorName && (
          <section className="mt-5">
            <p className="text-muted">{t("projectsPage.addedBy")}: {project.authorName}</p>
          </section>
        )}

        <section className="pb-3 my-5 text-center">
          <h4 className="mb-3">{t("projectsPage.interested")}</h4>
          <NavLink to="/contact" className="btn hero-btn">
            {t("projectsPage.collaborateBtn")}
          </NavLink>
        </section>

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
