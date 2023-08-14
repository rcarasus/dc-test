import firebase from 'firebase';
import { auth } from './_firebase';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { EmailErr, showElement, hideElement, focusElement } from './_localprops';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CloseIcon from '@material-ui/icons/Close';
import './Login.css';


function showHelpOptions() {
    var a = document.getElementById("needForgot");
    var b = document.getElementById("needOther");
    var c = document.getElementById("ArrowRightIcon");
    var d = document.getElementById("ArrowDropDownIcon");
    a.style.display = (a.style.display == "block" ? "none" : "block");        
    b.style.display = (b.style.display == "block" ? "none" : "block");
    c.style.display = (c.style.display == "none" ? "block" : "none");
    d.style.display = (d.style.display == "block" ? "none" : "block");
}



function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [errorTitle, setErrorTitle] = useState("");
    const [loginStep, setLoginStep] = useState(1);

    const checkEmailErr = e => {
        if (EmailErr(email) == "empty") return "Enter your email or mobile phone number";
        if (EmailErr(email) == "invalid") return "Enter a valid email address or mobile number";
        if (EmailErr(email) == "phone" || EmailErr(email) == "") hideElement(".frmErMsgEmailE");
    }
    
    const resend_Verification = e => {
        e.preventDefault();
        auth
            .signInWithEmailAndPassword(email, password)
            .then((auth) => {
                firebase.auth().currentUser.sendEmailVerification();
                firebase.auth().signOut();
                showElement(".errorContainer");
            })
            .catch(error => {
                console.log(error);
            })
    }

    const signIn = (e) =>{
        e.preventDefault();
        // Check Password
        if (!password) {
            //Empty Password
            showElement(".frmErMsgPassE");
            hideElement(".errorContainer");
        } else {
            hideElement(".errorContainer");
            hideElement(".frmErMsgPassE");
        }

        // WRONG EMAIL FORMAT
        if (EmailErr(email) !== "" && EmailErr(email) !== "phone") {
            showElement(".frmErMsgEmailE"); hideElement(".errorContainer");
        }


        //LOGIN WITH PHONE NUMBER AND PASSWORD
        if (EmailErr(email) == "phone" && password) {
            
        }
        
        //CHECK EMAIL ONLY
        if (EmailErr(email) == "" && loginStep === 1) {
            //CHECK IF EMAIL IS REGISTER
            firebase.auth().fetchSignInMethodsForEmail(email)
                .then(provider => {
                    //LENGTH IS > 0, EMAIL IS REGISTER, PROCEED TO STEP TWO
                    if (provider.length > 0) {
                        showElement(".steptwo_login")
                        showElement(".remember")
                        focusElement(".inputPass")
                        hideElement(".stepone_login")
                        hideElement(".errorContainer")
                        hideElement(".footer_section_a")
                        hideElement(".needHelp")
                        hideElement(".needForgot")
                        hideElement(".needOther")
                        hideElement(".login_register__container")
                        hideElement(".login_registerbutton_container")
                        setLoginStep(2)
                    }
                    else {
                    // EMAIL IS NOT REGISTER
                        setErrorMessage("We cannot find an account with that email address")
                        setErrorTitle("There was a problem");
                        showElement(".errorContainer");
                        hideElement(".frmErMsgEmailE");
                        hideElement(".errorContainer_text_resend");
                    }
                })
                .catch(error => {
                    // OTHER CONCERNS
                    console.log(error)
                    setErrorMessage(error.message)
                    setErrorTitle("There was a problem");
                    //showElement(".errorContainer");
                    hideElement(".frmErMsgEmailE");
                    hideElement(".errorContainer_text_resend");
                })
        } 
            

        //CHECK EMAIL AND PASSWORD
        if (password && EmailErr(email) == "" && loginStep === 2) {
            auth.signInWithEmailAndPassword(email, password)
                .then((auth) => {
                    // Sign in but account not verified yet
                    if (!auth.user.emailVerified) {
                        setErrorMessage("Your account is not verified yet.  Please check your email to verify your account.");
                        setErrorTitle("Verification needed");
                        showElement(".errorContainer");
                        showElement(".errorContainer_text_resend");
                        hideElement(".frmErMsgPassE");
                        firebase.auth().signOut();
                        // Sign in but account not verified yet
                    } else {
                        // Sign in with verified account - redirect to Home page
                        history.push('/' + auth.user.displayName);
                    }
                })
                .catch(error => {
                    if (error.code == "auth/wrong-password" && !password) setErrorMessage("Your password is incorrect")
                    else
                        if (error.code == "auth/too-many-requests") setErrorMessage("Too many request, please try again later or reset your password.")
                    else setErrorMessage(error.message);
                    setErrorTitle("There was a problem");
                    showElement(".errorContainer");
                    hideElement(".frmErMsgPassE");
                    hideElement(".errorContainer_text_resend");
                    console.log(error)
                });
        }
    }
            return (
                <div className='login'>
                    <div>
                        <Link to="/">
                            <img className="login__logo" src='logo_advisor.png'></img>
                        </Link>
                    </div>
                    <div className="errorContainer">
                        <div><img src="icons/alert_.png" className="errorContainer_icon" /></div>
                    
                        {/* Dynamic ERROR MESSAGE HEADER*/}
                        <div className="errorContainer_title">{errorTitle}<h4 className="error_header"></h4>
                            {/* Dyanamic ERROR MESSAGE*/}
                            <p className="errorContainer_text">{errorMessage}</p>
                            <a className="errorContainer_text_resend" href='' onClick={resend_Verification}> click here to resend verification email.</a>
                        </div>
                    </div>
                    <div className='login__container'>
                        <h1>Sign-In</h1>
                        <form className="formlayout" onSubmit={e=> signIn(e)}>
                            <div className="stepone_login">
                                <h5>Email or mobile phone number</h5>
                                <input className="inputEmail" type='text' value={email} onChange={e => setEmail(e.target.value)} />
                                <p className="frmErMsgEmailE"><img src="icons/error_ico.png" />{checkEmailErr()}</p>
                                <div id="recaptcha_login"></div>
                                <button type='submit' onClick={(e)=>signIn(e)} className='login__signInButton'>Continue</button>
                            </div>
                            <div className="steptwo_login">
                                <p>{email} <a href="/login">Change</a></p>
                                <div className="password_label">
                                    <h5>Password</h5>
                                    <Link to={{ pathname: '/forgotpassword', state: { prevPath: window.location.pathname } }}>Forgot your password?</Link>
                                </div>
                                <input className="inputPass" type='password' value={password} onChange={e => setPassword(e.target.value)} />
                                <div className="frmErMsgPassE"><img src="icons/error_ico.png"/>Enter your password</div>
                                <button type='submit' onClick={(e) => signIn(e)} className='login__signInButton'>Sign-In</button>
                            </div>
                        </form>

                        <p className="footer_section_a">By continuing, you agree to Arkeo's<a href=""> Conditions of Use</a> and <a href="">Privacy Notice</a>.</p>
                        <div className="needHelp">
                            <div className="ArrowRightIcon" id="ArrowRightIcon"><ArrowRightIcon fontSize="small" /></div>
                            <div className="ArrowDropDownIcon" id="ArrowDropDownIcon"><ArrowDropDownIcon fontSize="small" /></div>
                            <Link to="/login" onClick={() => showHelpOptions()}>Can't sign in to your account?</Link>
                        </div>
                        <Link to={{ pathname: '/forgotpassword', state: { prevPath: window.location.pathname } }}>
                            <div className="needForgot" id="needForgot">Forgot your password?</div>
                        </Link>
                        <div className="needOther" id="needOther"><a href="">Other issues with Sign-In</a></div>
                        
                            <div className="toolTip_details" >
                                <p className="toolTip_details_title">
                                    <span>"Keep Me Signed In" Checkbox</span><a><CloseIcon fontSize="small" onClick={()=>hideElement(".toolTip_details")}/></a>
                                </p>
                                <p className="toolTip_details_text">
                                    Choosing "Keep me signed in" reduces the number of times you're asked to Sign-In on this device.
                                    <br/><br/>To keep your account secure, use this option only on your personal devices.
                                </p>
                            </div>
                        <div onBlur={()=>hideElement(".toolTip_details")} className="remember"><input type="checkbox" value="false"/><p>Keep me signed in. <Link to="#" onClick={()=>showElement(".toolTip_details")}>Details <ArrowDropDownIcon id="arrowdown2" fontSize="small"/></Link></p></div>
                    </div>
                    <div className='login_register__container'>
                        <div className="lineDivider"></div>
                        <div className="centerLabel">New to Arkeo?</div>
                        <div className="lineDivider"></div>
                    </div>
                    <Link to={{ pathname: '/register', state: { prevPath: window.location.pathname } }}>
                        <div className="login_registerbutton_container"><button>Create your Account</button></div>
                    </Link>
                </div>
            )
    }

export default Login
