import React from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

const Summary = ({ blog }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  // fallback to English if selected language content is missing
  const title = blog?.title?.[lang] || blog?.title?.en || "";
  const content = blog?.content?.[lang] || blog?.content?.en || "";

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${blog.id}`}
          aria-expanded="false"
          aria-controls={`collapse${blog.id}`}
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse${blog.id}`}
        className="accordion-collapse collapse"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <div
            className="blog-content-preview mb-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content.slice(0, 700) + "..."),
            }}
          />
          <Link to={`/blogs/${blog.id}`}>{t("readMore")}</Link>
        </div>
      </div>
    </div>
  );
};

export default Summary;
