import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLink = () =>{
    return (
        <div className="norrechel-navbar">
         <ul className="nav-links d-flex align-items-center">
            <li className="nav-item dropdown ">
                <NavLink to='/login' className="btn btn-sm auth-btn">Login</NavLink>
            </li>
            <li className="nav-item dropdown ">
                <NavLink to='/register' className="btn btn-sm auth-btn">Register</NavLink>
            </li>
         </ul>
        </div>
    )
}

export default SignedOutLink