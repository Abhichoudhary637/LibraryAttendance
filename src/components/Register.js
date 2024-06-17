import React from 'react'
import logoBg from '../img/logo.png'

function Register() {
    return (
        <>
            <div className='main_wrp'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='registration_wrp position-relative'>
                            <div className='bg_wrp w-65'>
                                <div className='clg_logo'>
                                    <img src={logoBg} className='p-3' />
                                </div>
                            </div>
                            <div className='w-65 registration_form p-4 bg-dark text-white position-absolute'>
                                <div className='w-50 mx-auto'>
                                    <div className='text-center'>
                                        <h2>Create New Account</h2>
                                        <p>Already Registered? Login</p>
                                    </div>
                                    <form className='px-5 py-3 reg_form'>
                                        <div class="mb-2">
                                            <label>Name</label>
                                            <input type="text" class="form-control" id='name' name='name' />
                                            {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                                        </div>
                                        <div class="mb-2">
                                            <label>Email address</label>
                                            <input type="email" class="form-control" id="emailid" name='emailid' />
                                            {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                                        </div>
                                        <div class="mb-2">
                                            <label>Password</label>
                                            <input type="password" class="form-control" id="password" name='password' />
                                            {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                                        </div>
                                        <div class="mb-5">
                                            <label>Date of birth</label>
                                            <input type="date" class="form-control" id="dob" name='dob' />
                                            {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                                        </div>
                                        <div className='text-center'>
                                            <button type="button" class="btn btn-warning px-5">Sign Up</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Register