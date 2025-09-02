import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Footer from './footer'

function Acceuil() {
    const blogs = useSelector(state=>state);
    // const latestBlogs = blogs.slice(0, 3);
    // console.log(latestBlogs);

  return (
    <>
    <div id="main">
        <div className="container">
            {/* Hero Section */}
            <section className="hero text-center py-5 d-flex flex-column justify-content-center align-items-center">
                 <h1 className="display-5 fw-bold mb-3">Empower Your Potential</h1>
                <p className="lead mb-4">
                    We inspire and equip young people to discover their potential, build strong character, 
                    raise their value, and commit to achieving their goals.
                </p>
                <NavLink 
                    to="/blogs" 
                    className="btn btn-sm px-4 hero-btn"
                >
                    Explore Blogs
                </NavLink>
            </section>
            {/* Featured Categories */}
            <section className="home-categories home-section my-5">
            <h2 className="mb-4 text-center">Our Focus Areas</h2>
            <div className="row text-center">
                <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                    <i className="bx bx-brain fs-1 mb-3"></i>
                    <h3>Personal Growth</h3>
                    <p>Discover yourself, develop your character, and grow into your potential.</p>
                </div>
                </div>
                <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                    <i className="bx bx-star fs-1 mb-3"></i>
                    <h3>Value & Impact</h3>
                    <p>Learn how to raise your value, contribute to your community, and make a difference.</p>
                </div>
                </div>
                <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                    <i className="bx bx-rocket fs-1 mb-3"></i>
                    <h3>Goal Achievement</h3>
                    <p>Commit to actions that push you forward and help you reach your dreams.</p>
                </div>
                </div>
            </div>
            </section>
            {/* Latest Blogs */}
            <section className="latest-blogs home-section my-5">
            <h2 className="mb-4 text-center">Latest Blogs</h2>
            <div className="row">
                <div className="col-md-4 mb-4">
                <div className="blog-card norrechel-card p-3 h-100">
                    <h3>Unlock Your Potential</h3>
                    <p>By John Doe • Aug 30, 2025</p>
                    <NavLink to="/blogs/1" className="read-more">Read More →</NavLink>
                </div>
                </div>
                <div className="col-md-4 mb-4">
                <div className="blog-card norrechel-card p-3 h-100">
                    <h3>Building Character for Success</h3>
                    <p>By Jane Smith • Aug 29, 2025</p>
                    <NavLink to="/blogs/2" className="read-more">Read More →</NavLink>
                </div>
                </div>
                <div className="col-md-4 mb-4">
                <div className="blog-card norrechel-card p-3 h-100">
                    <h3>Commitment & Goal Setting</h3>
                    <p>By Alex Roe • Aug 28, 2025</p>
                    <NavLink to="/blogs/3" className="read-more">Read More →</NavLink>
                </div>
                </div>
            </div>
            <div className="text-center mt-3">
                <NavLink to="/blogs" className="btn btn-outline-primary">View All Blogs</NavLink>
            </div>
            </section>
            {/* About */}
            <section className="about home-section bg-white container mb-3 py-4 text-center">
                <h2>About Norrechel</h2>
                <p className="lead">
                    Norrechel is dedicated to empowering young people to discover their potential, 
                    develop strong character, raise their value, and take committed action towards 
                    achieving their goals. Our content inspires, motivates, and provides actionable 
                    insights for growth and success.
                </p>
                <NavLink to="/about" className="hero-btn btn btn-primary mt-3">
                    Learn More
                </NavLink>
                </section>

            
            {/* Newsletter */}
            <section className="newsletter container text-center">
                <h2>Stay Updated!</h2>
                <p>Get the latest articles straight to your inbox.</p>
                <form className='d-flex'>
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit" className="btn sub-btn">Subscribe</button>
                </form>
            </section>
        </div>
    </div>
    <Footer />
    </>
  )
}

export default Acceuil;