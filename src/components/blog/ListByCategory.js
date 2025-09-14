import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCategory } from "../store/actions/categoryModel";
import { getBlog } from "../store/actions/BlogModel";
import Blog from "../blog/List";
import { useTranslation } from "react-i18next";

function BlogByCategory() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const auth = useSelector((state) => state.auth.user);
  const category = useSelector((state) => state.category.categories || null);
  const blogs = useSelector((state) => state.blog.blogs || []);

  // Load category by ID when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(getCategory("id", id));
    }
  }, [id, dispatch]);

  // Load blogs once category is available
  useEffect(() => {
    if (category && category.name) {
      dispatch(getBlog("category", category.name));
    }
  }, [category, dispatch]);

  return (
    <div id="main">
      <div className="container">
        <div className="row">
          {!category ? (
            <p>{t("Loading category...")}</p>
          ) : !blogs ? (
            <p>{t("Loading blogs...")}</p>
          ) : blogs.length === 0 ? (
            <h2>{t("No Blog found in this Category")}</h2>
          ) : (
            <>
              <div className="col-4 m-0">
                <div className="category-content">
                  <h2>{t("Category")}</h2>
                  <p>{category.name}</p>
                </div>
              </div>
              <div className="col-8 col-md-8 col-sm-8">
                <Blog blogs={blogs} auth={auth} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogByCategory;
