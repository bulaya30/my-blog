import React, { Component } from 'react';
import { connect } from 'react-redux';
import Category from '../category/List';
import Blog from '../blog/List';
// import { getBlog } from '../store/actions/BlogModel';
// import { getCategory } from '../store/actions/categoryModel';

class Home extends Component {
    // componentDidMount() {
    //   this.props.getBlog();
    //   this.props.getCategory();
    // }
  render() {
    return (
      <div id="main">
        <div className="container p-1">
          <div className="row mb-0">
            <div className="slider">
              <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item slide-1 active">
                    <p>
                      "Your success in life depends more on the person you become than on the things you do or acquire."<br />
                    </p>
                    <i>"The ultimate end of life is the development of Character"</i>
                  </div>
                  <div className="carousel-item slide-2">
                    <p>"The first and best victory is to conquer self"</p>
                  </div>
                  <div className="carousel-item slide-3">
                    <p>"Discipline is the bridge between Goals and Accomplishment"</p>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="container ps-3 g-0">
              <div className="row">
                <div className="col-4 mb-3">
                  <Category />
                </div>
                <div className="col-8">
                  <div className="blog-main-contents pe-3">
                    <div className="blog-list">
                      <div className="row">
                        <Blog />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blog.blogs,
    categories: state.category.categories
  };
}

export default connect(mapStateToProps)(Home);
