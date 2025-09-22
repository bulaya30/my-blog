import React, { useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProjects } from "../store/actions/ProjectModel";
import Footer from "../home/footer";

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const project = useSelector((state) =>
    Array.isArray(state.project.projects)
      ? state.project.projects.find((b) => b.id === id)
      : state.project.projects?.id === id
      ? state.project.projects
      : null
  );

  useEffect(() => {
    dispatch(getProjects("id", id));
  }, [dispatch, id]);

  if (!project) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-5 fw-bold">
        {t("projectsPage.notFound")}
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
            <section className="mb-4">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm hero-btn"
              >
                {t("projectsPage.viewProject")}
              </a>
            </section>
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
      </main>
      <Footer />
    </>
  );
};

export default ProjectDetails;
