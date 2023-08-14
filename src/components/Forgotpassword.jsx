import { auth } from './_firebase';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Forgotpassword.css';
import { EmailErr, hideElement, showElement } from './_localprops';



function Forgotpassword() {    
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [errorTitle, setErrorTitle] = useState("");
    var verificationSent = false;
    
    //CHECK EMAIL ON CHANGE
    const checkEmailErr = e => {
        if(EmailErr(email)==="empty") return "Enter your email or mobile phone number";
        if(EmailErr(email)==="invalid") return "Enter a valid email address";
        if (EmailErr(email)==="" || EmailErr(email) === "phone") hideElement(".frmErMsgEmailE");        
    }
    
    //CHECK EMAIL ON SUBMIT
    const handleClickSubmit = e => {
        e.preventDefault();
        // Email
        if (EmailErr(email) !== "") {
            showElement(".frmErMsgEmailE");
            hideElement(".errorContainer");
        }

        if (!verificationSent) {
            if (EmailErr(email) === "") {
                // send email reset verification
                auth
                    .sendPasswordResetEmail(email)
                    .then(function () {
                        //REDIRECT TO EMAIL CONFIRMATION PAGE ******* FIX?
                        verificationSent = true;
                        showElement(".header_note")
                        showElement(".login_registerButton_sign", true)
                        document.querySelector('.header_note_instructions').style.color = "green"
                        document.querySelector('.header_note_instructions').innerHTML = "We've sent you an email at <strong>" + email + "</strong> with a link to reset your password."
                        hideElement('.login_registerButton_cont')
                        hideElement('.forgotPassword_form')
                        hideElement(".errorContainer")
                        hideElement(".frmErMsgEmailE");
                    })
                    .catch(error => {
                        if (error.code === "auth/user-not-found") setErrorMessage("We're sorry. We weren't able to identify you given the information provided.")
                        else
                            setErrorMessage(error.message)
                        setErrorTitle("There was a problem")
                        showElement(".errorContainer")
                    });
                
            }
        } else {
            history.push("/login")
        }
    }
    
    try {
        //Check if Previous URL is Login page
        if (history.location.state.prevPath === '/' || history.location.state.prevPath === '/login' || history.location.state.prevPath === '/register') {
            return (
                <div className='login'>
                    <div>
                        <Link to="/">
                            <img className="login__logo" src='./logo_advisor.png'></img>
                        </Link>
                    </div>
                    <div className="errorContainer">
                        <div><img src="icons/alert_.png" className="errorContainer_icon" /></div>
                        <div className="errorContainer_title">
                            <h4>{errorTitle}</h4>
                            <p className="errorContainer_text">{errorMessage}</p>
                        </div>
                    </div>
                    <div className='login__container'>
                        <div className="header_note">
                            <h1 className="h1_forgotpassword">Password assistance</h1>
                            <p className="header_note_instructions">Enter the email address or mobile phone number associated with your Arkeo account.</p>
                        </div>
                        <form className="forgotPassword_form" onSubmit={handleClickSubmit}>
                            <h5>Email or mobile phone number</h5>
                            <input className="inputEmail" type='text' value={email} onChange={e => setEmail(e.target.value)} />
                            <p className="frmErMsgEmailE"><img src="icons/error_ico.png" />{checkEmailErr()}</p>
                        </form>
                        
                        <button onClick={handleClickSubmit} className='login_registerButton_cont'>Continue</button>
                        <Link to={{ pathname: '/login', state: { prevPath: window.location.pathname } }}>
                            <button className='login_registerButton_sign'>Sign-in</button>
                        </Link>
                    </div>
                    <div className="note_below">
                        <h3>Has your email or mobile number changed?</h3><p>
                            If you no longer use the email address associated with your Arkeo account, you may contact <a>Customer Service</a> for help restoring access to your account.</p>
                    </div>
                </div>
            )
        }
    }
     //return to LOGIN PAGE if direct access the Register URL or previous path is not Login page
    catch (error) {
        return (
            <div>
                {history.push("/login")}
            </div>)
    }       
}

export default Forgotpassword