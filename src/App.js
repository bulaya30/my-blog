import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/navigations/NavBar';
import Acceuil from './components/home/Acceuil';
import Home from './components/home/Home';
import About from './components/home/About';
import Contact from './components/home/Contact';
import Details from './components/blog/Details';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/pages/Profile';
import BlogByCategory from './components/blog/ListByCategory';
import EditCategory from './components/category/Update';
import UpdateBlog from './components/blog/Update';
import { SidebarProvider } from './components/context/sidebarContext';
import Author from './components/home/Author';
import Projects from './components/Projects/Project';
import ProjectDetails from './components/Projects/ProjectDetails';
import UpdateProject from './components/Projects/UpdateProject';


// Import Bootstrap & CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';
import './css/norrechel.main.css';
import './css/norrechel.profile.css';
import './css/norrechel.mobile.css';
import './css/norrechel.editor.css'
export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <SidebarProvider>
          <div className="App">
            <NavBar />
            <Routes>
              <Route exact path='/' element={<Acceuil />} />
              <Route exact path='/blogs' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/blogs/:id' element={<Details />} />
              <Route path='/blogs/:id/edit' element={<UpdateBlog />} />
              <Route path='/categories/:id' element={<BlogByCategory />} />
              <Route path='/categories/:id/edit' element={<EditCategory />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/projects' element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path='/projects/:id/edit' element={<UpdateProject />} />
              <Route path="/author/:authorId" element={<Author />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    );
  }
}

export default App;
