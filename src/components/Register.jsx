import firebase from "firebase";
import { auth} from './_firebase';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useStateValue } from './_stateprovider';
import './Register.css';
import { setElement, EmailErr } from './_localprops';

function Register() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [{ user }] = useStateValue();
    const handleAuthentication = () => {
        if (user) {
            auth.signOut();
        }
    }
    
    const getPassErrorMessage = e => {
        var temp1 = '';
        if (password.length < 6) {
            if (!password) temp1 = "Enter your password";
            else
                temp1 = "Passwords must be at least 6 characters.";
        } else {
            setElement(".frmErMsgPassE", ".inputPass");
        }
        return temp1;
    }

    const getRepassErrorMessage = e => {
        var temp2 = '';
        if (!repassword) temp2 = "Type your password again";
        
        if (repassword && password !== repassword)
            temp2 = "Passwords must match";
        
        if (repassword && password == repassword)
            setElement(".frmErMsgRpassE", ".inputRepass");
        return temp2;
    }

    const checkEmailErr = e => {
        switch (EmailErr(email)) {
            case "empty": return "Enter your email";
            case "invalid":
            case "phone": return "Enter a valid email address";
            default: setElement(".frmErMsgEmailE", ".inputEmail");
        }
    }
       

    


    const register = e => {
        e.preventDefault();
        var formIsValid = false;
        var msg1 = "";
        var msg2 = "";
        document.querySelector(".formInfoMessage").style.display = "none";

        // Username
        if (!username.trim()) setElement(".frmErMsgUnameE", ".inputUname", "ERROR");
        else {
            setElement(".frmErMsgUnameE", ".inputUname");
        }
            
        // Email
        if (EmailErr(email) !== "") setElement(".frmErMsgEmailE", ".inputEmail", "ERROR");
        else {
            setElement(".frmErMsgEmailE", ".inputEmail");
        }
        
        // Passwords
        if (password.length < 6) {
            setElement(".frmErMsgPassE", ".inputPass", "ERROR");
        }
        else {
            setElement(".frmErMsgPassE", ".inputPass", "");
        }
            
        if (password && password !== repassword) {
            setElement(".frmErMsgRpassE", ".inputRepass", "ERROR");
        } else {
            setElement(".frmErMsgRpassE", ".inputRepass");
        }
        

        // set focus to NAME or EMAIL if error
        if (!username.trim()) {
            document.querySelector(".inputUname").focus();
        } else {
            if (!EmailErr(email) == "") {
                document.querySelector(".inputEmail").focus();
            }
        }


        // REGISTER DATA
        if (username.trim() !== "" && EmailErr(email) == "" && (password.length > 5 && password == repassword)) {
            var user = null;
            //nullify empty arguments
            for (var i = 0; i < arguments.length; i++) {
                arguments[i] = arguments[i] ? arguments[i] : null;
            }
          
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function () {
                    user = firebase.auth().currentUser;
                    user.sendEmailVerification();
                })
                .then(function () {
                    user.updateProfile({
                        displayName: username,
                        photoURL: ""
                    });
                })
                .then(function () {
                    // Successful registration, SIGN-OUT redirect to Verification Section
                    handleAuthentication();
                    msg1 = "Please check your email to verify your account.";
                    msg2 = "Verification needed";
                    document.querySelector('.reg_errorContainer').style.color = "green"
                    document.querySelector('.login__container').style.display = 'none';
                    setElement(".reg_errorContainer", "")
                    setElement(".reg_errorContainer", "", "NA", ".reg_errorContainer_text", msg1, ".error_header", msg2);
                    setElement(".reg_errorContainer", "", "ALERT", ".login__container", "", ".reg_note_below");
                    //if (auth) { history.push('/login') }
                })
                .catch(error => {
                    // Email already exist: show Alert section and hide Entry section
                    if (error.code == "auth/email-already-in-use") {
                        setElement(".reg_errorContainer", "", "ALERT", ".login__container", "", ".reg_note_below");
                    }
                });
        }

    }
    try {
        //Check if Previous URL is Login page
        console.log("History:" + history.location.state.prevPath);
        if (history.location.state.prevPath === '/' || history.location.state.prevPath === '/login') {
            return (
                <div className='login'>
                    <div>
                        <Link to="/">
                            <img className="login__logo" src='./logo_advisor.png'></img>
                        </Link>
                    </div>
                    <div className="reg_errorContainer">
                        <div><img src="icons/alert_.png" className="reg_errorContainer_icon" /></div>
                        <div className="reg_errorContainer_title">
                            <h4 className="error_header">Email address already in use</h4>
                            <p className="reg_errorContainer_text">
                                You indicated you are a new advisor or student, but an account already exists with the e-mail <strong>{email}</strong>
                            </p>
                        </div>
                    </div>
                    <div className='login__container'>
                        <h1>Create account</h1>
                        <form onSubmit={register}>
                            <h5>Your name</h5>
                            <input className="inputUname" type='text' value={username} onChange={e => setUsername(e.target.value)} />
                            <p className="frmErMsgUnameE"><img src="icons/error_ico.png" />Enter your name</p>
                            <h5>Email</h5>
                            <input className="inputEmail" type='text' value={email} onChange={e => setEmail(e.target.value)} />
                            <p className="frmErMsgEmailE"><img src="icons/error_ico.png" />{checkEmailErr()}</p>
                            <h5>Password</h5>
                            <input className="inputPass" type='password' placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                            <p className="formInfoMessage"><img src="icons/i_ico.png" />Passwords must be at least 6 characters.</p>
                            <p className="frmErMsgPassE"><img src="icons/error_ico.png" />{getPassErrorMessage()}</p>
                            <h5>Re-enter password</h5>
                            <input className="inputRepass" type='password' value={repassword} onChange={e => setRepassword(e.target.value)} />
                            <p className="frmErMsgRpassE"><img src="icons/error_ico.png" />{getRepassErrorMessage()}</p>
                            <button onClick={register} className='login_registerButton'>Create your Arkeo account</button>
                        </form>
                        <p>By continuing, you agree to Arkeo's <a href="">Conditions of<br /> Use</a> and <a href="">Privacy Notice</a>.</p>
                        <hr />
                        <p>Already have an account? <Link to={{ pathname: '/login', state: { prevPath: window.location.pathname } }}>Sign-In</Link></p>
                    </div>

                    <div className="reg_note_below">
                        <h3>Are you a returning advisor or student?</h3>
                        <p><Link to={{ pathname: '/login', state: { prevPath: window.location.pathname } }}>Sign-In</Link></p>
                        <p><Link to={{ pathname: '/forgotpassword', state: { prevPath: window.location.pathname } }}>Forgot your password?</Link></p>
                        <h3>New to Arkeo.com?</h3>
                        <p>Create a new account with <a href="" onClick={() => window.load()}>a different e-mail address</a></p>
                        <p>Create a new account with <a>this e-mail address</a></p>
                        <h3>Still need help?</h3>
                        <p><a>Contact Customer Service</a></p>
                    </div>
                    {window.onload = (e) => document.querySelector(".inputUname").focus()}
                </div>
            )
        }
    }
    //return to LOGIN PAGE if direct access the Register URL or previous path is not Login page
    catch (error) {
        return (
            <div>
                {console.log("History:" + history.location.state.prevPath)}
                {history.push("/login")}
            </div>)
    }
    
}
export default Register

