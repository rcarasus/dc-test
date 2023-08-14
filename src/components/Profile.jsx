import ReactDOM from 'react-dom';
import { storageBucket, storage } from './_firebase';
import { Avatar, IconButton, makeStyles, TextField } from '@material-ui/core';
import React, { useState, useEffect} from 'react';
import { create, read, update, deleted, search, clearProfileCache } from './_profileCrud';
import './Profile.css';
import { readCompensation } from './_compensationCrud';
import SchoolIcon from '@material-ui/icons/School';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SaveIcon from '@material-ui/icons/Save';
import { renderToStringWithData } from '@apollo/react-ssr';
import { hideElement, showElement } from './_localprops';
import { useStateValue } from './_stateprovider';
import { delAvatarPath, getAvatarPath, setAvatarPath } from './_globalVars';
//import { defaultDataIdFromObject } from 'apollo-cache-inmemory';

var imageFiles = []  // global var for image files

function genAFSCode() {
    let temp = 'AFS'
    temp = temp +
        Math.floor(Math.random() * 0) +
        Math.floor(Math.random() * 0) +
        Math.floor(Math.random() * 0) +
        Math.floor(Math.random() * 0) +
        Math.floor(Math.random() * 9) +
        Math.floor(Math.random() * 9) +
        Math.floor(Math.random() * 9)
    return temp;
}

function Profile(props) {
    const [{ user }] = useStateValue();
    const [tempAFSCode, setTempAFSCode] = useState();

    const init_compensationData = {
        AFSCode: '',
        NAME: '',
        Path: '',
        LTI: '',
        LEVEL: '',
        YTD: '',
        RATE: '',
        RESFUND: '',
        BALANCE: '',
        DownlineCount: '',
    }
    const fUID = user?.uid;
    const [profileData, setProfileData] = useState();
    const [foundCode, setFoundCode] = useState();
    const [compensationData, setCompensationData] = useState(init_compensationData);
    const [submitDisable, setSubmitDisable] = useState(true);
    const [showModal, setShowModal] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState('hidden');
    
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        xlarge: {
            width: theme.spacing(12),
            height: theme.spacing(12),
        },
        indicator: {
            top: "0px",
            background: "#118b76",
            height: '3px',
        },
    }));
    const classes = useStyles();
    
    //Confirm Modal
    const confirm = (isUpdate) => {
        setShowModal(<div className="modal show fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ "display": "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Message</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(<></>)}></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to {isUpdate ? 'update' : 'delete'} this record
            </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={() => setShowModal(<></>)} autoFocus={true}>No</button>
                        <button type="button" className="btn btn-success" onClick={() => isUpdate ? update(profileData.AFSCode, profileData) : deleted(profileData.AFSCode)}>Yes</button>
                    </div>
                </div>
            </div>
        </div>);
    }

    const avatarAppPath = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${fUID}%2Favatar%2F`
    //const initAvatarFile = `${avatarAppPath}avatar.jpg?alt=media`
    const [avatarFile, setAvatarFile] = useState(getAvatarPath)
    const imageDir_ref = 'avatar'
    const fileType = ['image/gif', 'image/jpeg', 'image/png'];
    const fileSize = 500000;
    const maxLength = 1;
    const validType = (e) => {
        for (let i = 0; i < fileType.length; i++) {
            if (e === fileType[i]) {
                return true
            }
        }
    }

    //save changes
    const handleUpdate = (e) => {
        update(profileData.AFSCode, profileData, setProfileData)
        clearProfileCache()
    }

    const handleUpdateNew = (e) => {
        //if (!foundCode) {
        create(tempAFSCode, profileData, setProfileData);
        setFoundCode(tempAFSCode)
        clearProfileCache()
    }

    //undo changes
    const handleUndo = (e) => {
        read(user?.uid, setProfileData)
        //delAvatarPath()
        clearProfileCache()
    }

    const [initValue, setInitValue] = useState(true)
    const hiddenFileInput = React.useRef(null)
    const initProdImage = { name: '', blob: '', uploadURL: '' }
    const [prodImage, setProdImage] = useState([])
    const handleBrowseImageFilesClick = () => {
        //if (prodImage.length < maxLength)
        hiddenFileInput.current.click()
        //else
        //log error: max file size reached
        //    logError('maxnum', true,  ' » max num of images: ' + props.maxLength)
    }

    //Handle Input Change
    const handleProfileChange = (e) => {
        var { name, value } = e.target
        setProfileData({ ...profileData, [name]: value });
    };

    const handleChangeFiles = e => {
        //  try {
        let files = []
        //get only files up to max length or number of files specified
        files = hiddenFileInput.current.files;
        
        //setProdImage(prodImage.filter((item) => item.blob !== '')); // remove empty IMAGE
        let num = files.length;
        let currentSize = prodImage.length
        if (num > 0) {
            setProdImage([]); // clear previous images
            for (let i = 0; i < num; i++) {
                let uploadURL = fUID === '' ? '' : `${avatarAppPath}${files[i].name}?alt=media`
                let ref = fUID === '' ? '' : `${fUID}/${imageDir_ref}/${fUID}/${files[i].name}`
                setProdImage(prodImage => [...prodImage,
                {
                    blob: URL.createObjectURL(files[i]),
                    name: files[i].name,
                    uploadURL: uploadURL,
                    notPosted: true,
                    ref: ref
                }])
                imageFiles = []; // clear previous images
                imageFiles.push(files[i])
                setAvatarFile(URL.createObjectURL(files[i]))
                setShowSaveButton('visible')
                setUpdateData(true)
            }
        }
        //  } catch (error) {
        //      console.log(error);
        //  }
    }

    //UPLOAD IMAGES TO FIREBASE
    const [uploadURL, setUploadURL] = useState('');

    const uploadFiles = (obj_image, currentKey, path) => {
        let numNewImages = obj_image.length;
        //let totalImages = obj_data.images.length
        if (numNewImages > 0) {
            let ctr = -1;
            for (let i = 0; i < obj_image.length; i++) {
                ctr++;
                const uploadTask = storage.ref(`${currentKey}/${path}${obj_image[i].name}`).put(obj_image[i])
                //const uploadTask = storage.ref(`${currentKey}/${path}avatar.jpg`).put(obj_image[i]) //overwrite with fixed filename
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                    },
                    error => {
                        console.log(error)
                    },
                    () => {
                        storage  // FILE GENERATED URL >> FOR FUTURE USE
                            .ref(`${path}${currentKey}/`)
                            .child(`${obj_image[i].name}`)
                            //.child(`avatar.jpg`) //overwrite with fixed filename
                            .getDownloadURL()
                            .then(url => {
                                setUploadURL(url)
                                console.log(url);
                            })
                    }
                )
            }
        }
    }
    const [updateData, setUpdateData] = useState(false);
    const handleSaveAvatar = (e) => {
        let path = `avatar/` // path for avatar files
        uploadFiles(imageFiles, fUID, path);  // upload new image files
        setAvatarFile(prodImage[0].blob)
        setShowSaveButton('hidden')
        setProfileData({ ...profileData, Path: prodImage[0].uploadURL })
        document.getElementById('profilePath').value = prodImage[0].uploadURL
        setAvatarPath(prodImage[0].uploadURL) // set global avatarPath
        setUpdateData(true)
    }

    const [tabValue, setTabValue] = useState(1);
    const [tabForm, setTabForm] = useState();
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case 1: {
                setTabForm('')
                showElement('profileForm')
                break;
            }
            default: {
                setTabForm('')
                hideElement('profileForm')
            }
        }
        //console.log(newValue)
    };

    
    const generateTempAFSCode = (e) => {
        let i = 0
        for (i = 0; i < e; i++){
            let temp=genAFSCode()
            search(temp, setFoundCode)
            if (!foundCode && temp) {
                setTempAFSCode(temp)
                break;
            }
        }
    }

    useEffect(() => {
        //generate AFSCode
        if (initValue) {
            read(user?.uid, setProfileData)
            setInitValue(false)
        }
        if (!profileData?.AFSCode) {
            generateTempAFSCode(100);
            setProfileData({ ...profileData, AFSCode: tempAFSCode })
            setProfileData({ ...profileData, fUID: user?.uid })
            document.getElementById('AFSCode').value = tempAFSCode
            setUpdateData(false)
            console.log(profileData?.AFSCode)
        } 
        
        //save changes to collections - mongoDB
        if (updateData && profileData?.AFSCode) {
            update(profileData.AFSCode, profileData, setProfileData);
            setUpdateData(false);
        }
        //read compensation data
        readCompensation(!profileData?.AFSCode ? 'AFSxxxxxxx' : profileData?.AFSCode, setCompensationData);
    }, []);

    return (
        <div className="userProfile">
        <h4>User Profile</h4>
        <div
          style={{
            display: "flex",
            justifyItems: "top",
            flex: "1",
          }}
        >
          {/*LEFT section*/}
          <div style={{ width: "25%", display: "block" }}>
            <div
              style={{
                background: "white",
                paddingTop: "15px",
                width: "100%",
                borderTop: "3px solid #118b76",
                borderBottom: "2px solid #f4f4f4",
                borderRadius: "3px 3px 0px 0px",
                maxHeight: "100%",
                overflowY: "auto",
                overflowx: "auto",
                display: "block",
                textAlign: "center",
                padding: "7px",
              }}
            >
              {/*AVATAR*/}
              <div
                className="saveButton"
                style={{
                  position: "absolute",
                  visibility: `${showSaveButton}`,
                }}
              >
                <IconButton onClick={handleSaveAvatar}>
                  <SaveIcon style={{ color: "#073a31" }} />
                </IconButton>
              </div>
              <span className="uploadContainer_hidden">
                <input
                  type="file"
                  //multiple
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={(e) => handleChangeFiles(e)}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                />
              </span>

              <div id="avatarDiv" style={{ width: "100%" }}>
                <IconButton onClick={handleBrowseImageFilesClick}>
                  <Avatar
                    alt={props.userName}
                    //src={profileData?.Path} className={classes.xlarge}
                    src={!avatarFile?profileData?.Path:avatarFile}
                    className={classes.xlarge}
                  />
                </IconButton>
              </div>

              <span style={{ width: "100%" }}>
                {/* <h5>{profileData?.FirstName + " " + profileData?.LastName}</h5> */}
                <h5>{props.userName}</h5>
                <p>{compensationData.LEVEL}</p>
              </span>
              {/*INFO*/}
              <div className="profileInfo">
                <span>Year-To-Date Income:</span>
                <span className="currencyStyle">${compensationData.YTD}</span>
              </div>
              <div className="profileInfo">
                <span>To-Date Income:</span>
                <span className="currencyStyle">${compensationData.LTI}</span>
              </div>
              <div className="profileInfo">
                <span>Reserved Fund:</span>
                <span className="currencyStyle">
                  ${compensationData.RESFUND}
                </span>
              </div>
              <div className="profileInfo">
                <span>Balance:</span>
                <span className="currencyStyle">
                  ${compensationData.BALANCE}
                </span>
              </div>
            </div>
            <div
              style={{
                background: "white",
                paddingTop: "15px",
                marginTop: "15px",
                width: "100%",
                borderTop: "3px solid #118b76",
                borderBottom: "2px solid #f4f4f4",
                borderRadius: "3px 3px 0px 0px",
                maxHeight: "100%",
                overflowY: "auto",
                overflowx: "auto",
                display: "block",
                padding: "10px",
              }}
            >
              <div className="profileSubheaderDiv">
                <span>About me</span>
                {/* <IconButton><EditIcon style={{ color: "#118b76" }} /></IconButton> */}
              </div>
              <div className="profileInfoText">
                <h6>
                  <SchoolIcon fontSize="small" /> Education
                </h6>
                <textarea 
                  className="textAreaStyle"
                  name='Education'
                  value={profileData?.Education}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="profileInfoText">
                <h6>
                  <LocationOnIcon fontSize="small" /> Location
                </h6>
                <textarea
                  disabled
                  className="textAreaStyle"
                  value={profileData?.Location}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="profileInfoText">
                <h6>
                  <PlaylistAddCheckIcon fontSize="small" /> Skills
                </h6>
                <textarea
                  className="textAreaStyle"
                  name='Skills'
                  value={profileData?.Skills}
                  onChange={handleProfileChange}
                />
              </div>
              <div>
                <h6>
                  <DescriptionIcon fontSize="small" /> Note
                </h6>
                <textarea
                  name='Note'
                  className="textAreaStyle"
                  value={profileData?.Note}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </div>

          {/*RIGHT section*/}
          <div style={{ width: "2%" }}></div>
          <div
            style={{
              background: "white",
              width: "100%",
              borderBottom: "2px solid #f4f4f4",
              borderRadius: "3px 3px 0px 0px",
              maxHeight: "100%",
              width: "73%",
              overflowY: "auto",
              display: "block",
            }}
          >
            <Paper square>
              <Tabs
                value={tabValue}
                textColor="primary"
                onChange={handleChangeTab}
                aria-label="disabled tabs example"
                classes={{ indicator: classes.indicator }}
              >
                <Tab label="Activity" />
                <Tab label="Personal" />
                <Tab label="Direct Deposit" />
                <Tab label="Security" />
              </Tabs>
            </Paper>
                    <div className="tabFormStyle">
                        {tabForm}
                        <div class="form-group row" id='profileForm'>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">AFS Code</label>
                                <input type="text"
                                    disabled
                                    class="form-control form-control-sm"
                                    id="AFSCode"
                                    name="AFSCode"
                                    placeholder='AFS Code'
                                    aria-label="AFS Code"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.AFSCode}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Last Name</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="LastName"
                                    placeholder="Last Name"
                                    aria-label="Last Name"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.LastName}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">First Name</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="FirstName"
                                    placeholder="First Name"
                                    aria-label="First Name"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.FirstName}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Street Address</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="Address"
                                    placeholder="Street Address"
                                    aria-label="Street Address"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.Address}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">City</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="City"
                                    placeholder="City"
                                    aria-label="City"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.City}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div class="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Province</label>
                                <select class="form-control form-control-sm"
                                    value={profileData?.Province}
                                    onChange={handleProfileChange}
                                    name="Province"
                                >
                                    <option selected>Choose...</option>
                                    <option value="AB">Alberta</option>
                                    <option value="BC">British Columbia</option>
                                    <option value="MB">Manitoba</option>
                                    <option value="NB">New Brunswick</option>
                                    <option value="NL">Newfoundland and Labrador</option>
                                    <option value="NS">Nova Scotia</option>
                                    <option value="ON">Ontario</option>
                                    <option value="PE">Prince Edward Island</option>
                                    <option value="QC">Quebec</option>
                                    <option value="SK">Saskatchewan</option>
                                    <option value="NT">Northwest Territories</option>
                                    <option value="NU">Nunavut</option>
                                    <option value="YT">Yukon</option>
                                    <option value="OT">Other(s)</option>
                                </select>
                            </div>
                            <div class="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Postal Code</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="Postal"
                                    placeholder="Postal Code"
                                    aria-label="Postal Code"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.Postal}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Corporate Email</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="CorporateEmail"
                                    placeholder="Corporate Email"
                                    aria-label="Corporate Email"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.CorporateEmail}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Personal Email</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="PersonalEmail"
                                    placeholder="Personal Email"
                                    aria-label="Personal Email"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.PersonalEmail}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="example-datetime-local-input" class="col-2 col-form-label">Date of Birth</label>
                                <div class="col-10">
                                    <input class="form-control form-control-sm"
                                        type="date"
                                        value={profileData?.DOB}
                                        name="DOB"
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Mobile Number</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="Mobile"
                                    placeholder="Mobile Number"
                                    aria-label="Mobile Number"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.Mobile}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="example-datetime-local-input" class="col-2 col-form-label">Date Started</label>
                                <div class="col-10">
                                    <input class="form-control form-control-sm"
                                        type="date"
                                        value={profileData?.DateStarted}
                                        onChange={handleProfileChange}
                                        name="DateStarted"
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </div>
                            <div class="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Status</label>
                                <select class="form-control form-control-sm"
                                    value={profileData?.Status}
                                    onChange={handleProfileChange}
                                    name="Status"
                                >
                                    <option selected>Choose...</option>
                                    <option value="Active">Active</option>
                                    <option value="Contracting">Contracting</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Terminate">Terminate</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Upline (AGA)</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="Upline"
                                    placeholder="Upline's AFS Code"
                                    aria-label="Upline's AFS Code"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.Upline}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Location</label>
                                <input type="text"
                                    class="form-control form-control-sm"
                                    name="Location"
                                    placeholder="Location"
                                    aria-label="Location"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.Location}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <input type="hidden"
                                    class="form-control form-control-sm"
                                    id='profilePath'
                                    name="Path"
                                    placeholder="Path"
                                    aria-label="Path"
                                    aria-describedby="basic-addon1"
                                    value={profileData?.Path}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="input-group mb-2">
                                <input type="text"
                                    class="form-control form-control-sm"
                                    id="fUID"
                                    name="Path"
                                    placeholder="fUID"
                                    aria-label="fUID"
                                    aria-describedby="basic-addon1"
                                    value={user?.uid}
                                />
                            </div>
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-warning" onClick={handleUndo}>Undo Changes</button>
                                <button type="button" className="btn btn-success" onClick={!profileData?.AFSCode?handleUpdateNew:handleUpdate}>Save Changes</button>
                                <button type="button" className="btn btn-danger">Delete</button>
                            {/*
                                <button type="button" className="btn btn-success" onClick={() => create(profileData.AFSCode, profileData)} disabled={submitDisable}>Create</button>
                                <button type="button" className="btn btn-primary" onClick={() => read(profileData.AFSCode)} disabled={submitDisable}>Read</button>
                                <button type="button" className="btn btn-warning" onClick={() => confirm(true)} disabled={submitDisable}>Update</button>
                                <button type="button" className="btn btn-danger" onClick={() => confirm(false)} disabled={submitDisable}>Delete</button>
                                */}
                            </div>
                        </div>
                    </div>
          </div>
        </div>
      </div>
    );
}

export default Profile
