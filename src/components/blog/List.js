import React, { useEffect } from "react";
import Summary from "./Summary";
import { useSelector, useDispatch } from "react-redux";
import { getBlog } from "../store/actions/BlogModel";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const blogs = useSelector((state) => state.blog.blogs || []);

  // Fetch blogs on mount
  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  // Ensure blogs is always an array
  const safeBlogs = Array.isArray(blogs) ? blogs : blogs ? [blogs] : [];
  // console.log(blogs.Array)

  if (safeBlogs.length === 0) {
    return (
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <p>{t("blog.noBlogAvailable")}</p>
      </div>
    );
  }

  // if (safeBlogs.length === 0) {
  //   return (
  //     <div className="text-start">
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="visually-hidden">{t("loading")}</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="accordion accordion-flush" id="accordionFlushExample">
      {safeBlogs.map((blog, index) => (
        <Summary blog={blog} key={blog.id || index} />
      ))}
    </div>
  );
};

export default Blog;
