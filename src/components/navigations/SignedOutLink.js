import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLink = () =>{
    return (
        <div className="norrechel-navbar">
         <ul className="nav__link d-flex align-items-center">
            <li className="nav-item dropdown pe-3">
                <NavLink to='/login' className="btn btn-sm p-1 auth-btn">Login</NavLink>
            </li>
            <li className="nav-item dropdown pe-3">
                <NavLink to='/register' className="btn btn-sm p-1 auth-btn">Register</NavLink>
            </li>
         </ul>
        </div>
    )
}

export default SignedOutLink