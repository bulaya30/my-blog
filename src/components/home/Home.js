import React, { Component } from 'react';
import Category from '../category/List';
import Blog from '../blog/List';

class Home extends Component {
  render() {
    return (
      <div id="main">
        <div className="container p-1">
          <div className="row">
            <div className="container ps-3 g-0">
              <div className="row">
                <h3 className='text-center fw-bold mb-3'>Articles</h3>
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

export default Home;
