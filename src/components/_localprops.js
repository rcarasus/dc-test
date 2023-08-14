import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { firebaseDb } from './_firebase';

function setElement(eOne, eTwo, s, eThree, msg1, eFour, msg2) {
    try {
        if (eTwo !== "") {
            if (s == "ERROR") {
                document.querySelector(eOne).style.display = "flex";
                document.querySelector(eTwo).style.border = "1px solid";
                document.querySelector(eTwo).style.borderColor = "#c40000";
                document.querySelector(eTwo).style.boxShadow = "0 0 2px #c40000";
                document.querySelector(eTwo).focus();
            } else {
                document.querySelector(eOne).style.display = "none";
                document.querySelector(eTwo).style.border = "1px solid";
                document.querySelector(eTwo).style.borderColor = "#a6a6a6;";
                document.querySelector(eTwo).style.boxShadow = "none";
            }
        }
        if (eTwo == "") {
            if (s == "NA") {
                document.querySelector(eOne).style.display = "flex";
                if (eThree !== undefined) document.querySelector(eThree).innerHTML = msg1;
                if (eFour !== undefined) document.querySelector(eFour).innerHTML = msg2;
            }

            if (s == "ALERT") {
                document.querySelector(eOne).style.display = "flex";
                document.querySelector(eThree).style.display = "none";
                document.querySelector(eFour).style.display = "flex";
            }
            if (s == null || s == undefined || s == "") {
                document.querySelector(eOne).style.display = "none";
            }
        }
    }
    catch (error)
    { alert(error.message);}
}  

function EmailErr(tempEmail) {
    var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!tempEmail.trim()) return "empty";
    if (tempEmail.length > 0) {
        if (!isNaN(tempEmail) && tempEmail.length >9) {
            return "phone";
        }
        else {
            if (!tempEmail.match(mailformat)) {
                return "invalid";
            } else
                return "";
        }
    } 
}

function getUsername(disp_name, longName) {
    try {
        let j = disp_name.indexOf(':');
        let i = (j<0 ? disp_name.indexOf(' ') : (disp_name.substring(0, j)).indexOf(' '));
                          //short name only                //short name & no space but with J    // no space and no J   // long name                          
        return (!longName?(i>0 ? disp_name.substring(0, i) : (j>0?disp_name.substring(0,j):        disp_name) ):          (j>1?disp_name.substring(0,j):disp_name));
    }
    catch(error) {
        console.log(error.code + ": " + error.description)
    }
}

function getCountryPhoneCode(disp_name) {
    try {
        let j = disp_name.indexOf(':');
        return (j > 0? disp_name.substring(j + 1).trim():"")
    }
    catch(error) {
        console.log(error.code + ": " + error.description)
    }
}


function Getflag(props) {
    return (
        <div>
            <ReactCountryFlag
                countryCode={props.countryCode}
                svg
                style={{
                    width: props.flagSize,
                    height: props.flagSize,
                }}
                title={props.countryName}
            />
        </div>
    )
}

const abbString = (str, len) => {
    return (str.substring(0, len) + (str.length > len? "..." : ""))
}


export const hideElement = (e) => {
    if (e.indexOf(".") === 0) {
        document.querySelector(e).style.display = "none"
    }
    else
        document.getElementById(e).style.display = "none"
        
}
export const showElement = (e, b) => {
    if (e.indexOf(".") === 0)
        document.querySelector(e).style.display = !b ? "flex" : "block"
    else
        document.getElementById(e).style.display = !b?"flex" : "block"
}
export const focusElement = (e) => {
    if (e.indexOf(".")===0)
        document.querySelector(e).focus()
    else
        document.getElementById(e).focus()
}
export const clearElement = (e) => {
    if (e.indexOf(".")===0)
        document.querySelector(e).value = null
    else
        document.getElementById(e).value = null
}

export const setValElement = (e, newValue) => {
    if (e.indexOf(".")===0)
        document.querySelector(e).value = newValue
    else
        document.getElementById(e).value = newValue
}


export const getDB = (dbPath, dbSetOBJ) => {
    firebaseDb.ref().child({dbPath})
            .on('value', snapshot => {
                if (snapshot.val() != null) {
                    dbSetOBJ({ ...snapshot.val() })
                }
                else {
                    dbSetOBJ({})
                }
            })
}

export { setElement, EmailErr, getUsername, getCountryPhoneCode, Getflag, abbString }




