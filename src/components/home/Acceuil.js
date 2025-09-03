import React, {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getBlog } from '../store/actions/BlogModel'
import { addSubscriber } from '../store/actions/SubscriberModel';
import Footer from './footer'

function Acceuil() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const blogs = useSelector(state => state.blog.blogs)
    const { error } = useSelector(state => state);
    useEffect(()=>{
        dispatch(getBlog())
    }, [dispatch])
    if (!blogs || blogs.length === 0) {
        return <div>Loading blogs...</div>;
    }
   const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await dispatch(addSubscriber(email));
  if (result.success) {
    alert('Thank you for subscribing!');
    setEmail('');
  } else {
    alert(result.message);
  }
};

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
                    {Array.isArray(blogs) && blogs.slice(0, 3).map(blog => (
                    <div key={blog.id} className="col-md-4 mb-4">
                        <div className="blog-card norrechel-card p-3 h-100">
                        <h3>{blog.title}</h3>
                        <p>
                            By {blog.author 
                                ? `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim()
                                : 'Unknown Author'} •{" "}
                            {blog.createdAt?.toDate 
                            ? blog.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'Unknown Date'}
                        </p>
                        <NavLink to={`/blogs/${blog.id}`} className="read-more">
                            Read More →
                        </NavLink>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="text-center mt-3">
                    <NavLink to="/blogs" className="btn hero-btn">View All Blogs</NavLink>
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
                <NavLink to="/about" className="hero-btn btn mt-3">
                    Learn More
                </NavLink>
                </section>

            
            {/* Newsletter */}
           <section className="newsletter container text-center my-5">
                <h2>Stay Updated!</h2>
                <p>Get the latest articles straight to your inbox.</p>
                
                <form className="d-flex justify-content-center" onSubmit={handleSubmit}>
                    <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    <button type="submit" className="btn sub-btn">Subscribe</button>
                </form>

                {error && <p className="text-danger mt-2">{error}</p>}
                {!error && email === '' && <p className="text-success mt-2">Thank you for subscribing!</p>}
                </section>
        </div>
    </div>
    <Footer />
    </>
  )
}

export default Acceuil;