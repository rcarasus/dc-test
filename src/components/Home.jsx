import React,  { useEffect, useState }  from 'react'
import './Home.css'
import { useHistory } from 'react-router-dom';
import { auth } from './_firebase';
//import { Link } from 'react-router-dom';
import Profile from './Profile.jsx';
import Highlights from './Highlights';
import Myteam from './Myteam';

import ProgressStatus from './_ProgressStatus'
import AvatarOnline from './_AvatarOnline'

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge, IconButton, } from '@material-ui/core';
import MenuOpenSharpIcon from '@material-ui/icons/MenuOpenSharp';
import MenuSharpIcon from '@material-ui/icons/MenuSharp';
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import ViewListOutlinedIcon from '@material-ui/icons/ViewListOutlined';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ContactPhoneOutlinedIcon from '@material-ui/icons/ContactPhoneOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import PolicyOutlinedIcon from '@material-ui/icons/PolicyOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import PermPhoneMsgOutlinedIcon from '@material-ui/icons/PermPhoneMsgOutlined';
import LiveHelpOutlinedIcon from '@material-ui/icons/LiveHelpOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import TocOutlinedIcon from '@material-ui/icons/TocOutlined';
import ContactMailOutlinedIcon from '@material-ui/icons/ContactMailOutlined';

import { hideElement, showElement } from './_localprops';
import { useStateValue } from './_stateprovider';
import { read, clearProfileCache } from './_profileCrud';
import { getAvatarPath, setAvatarPath } from './_globalVars';

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
}));

function Home(props) {
    const [{ user }] = useStateValue();
    const history = useHistory();
    const handleAuthentication = () => {
        clearProfileCache()
        auth.signOut()
        history.push('/')
    }

    //const [profileData, setProfileData] = useState();
    const [mainPadding, setMainPadding] = useState('225px');
    const [expand, setExpand] = useState(false);
    const [expandIcon, setExpandIcon] = useState(<ExpandMore />);
    const [displaySection, setDisplaySection] = useState();
    const [compensationSubMenu, setCompensationSubMenu] = useState();
    const classes = useStyles();
    const [fUID, setfUID] = useState(user?.uid);
    const handleDisplaySection = (e) => {
        switch (e) {
            case 'Profile': {
                hideElement('.sectionOne');
                setDisplaySection(<Profile fUID={fUID} userName={props.userName} />);
                break;
            }
            case 'Hierarchy': {
                hideElement('.sectionOne');
                setDisplaySection(<Myteam _AFSCode={props.profileData.AFSCode} height='100%' />);
                break;
            }
            default: {
                showElement('.sectionOne');
                //setDisplaySection(<Highlights AFSCode={profileData.AFSCode} />);
            }
                
        }
    }

    const handleClickExpand = () => {
        setExpand(!expand);
        if (!expand) {
            setExpandIcon(<ExpandLess />)
            setCompensationSubMenu(() => (
                <div className='submenuList'>
                <div className="menuListItem"><span className='submenuListItemIcon'><ReceiptOutlinedIcon fontSize='small' /></span><span className='submenuListItemText'>Statements</span></div>
                <div className="menuListItem"><span className='submenuListItemIcon'><TocOutlinedIcon fontSize='small' /></span><span className='submenuListItemText'>Transactions</span></div>
            </div>
            ))
        }
        else {
            setExpandIcon(<ExpandMore />)
            setCompensationSubMenu('')
        }
    }

    const handleClickBurger = (e) =>{
        switch (e){
            case 0: {
                hideElement('.MenuOpenSharpIcon')
                showElement('.MenuSharpIcon')
                hideElement('.sidebar')
                hideElement('.navbar-brand')
                setMainPadding('15px');
                break;
            }
            default: {
                showElement('.MenuOpenSharpIcon')
                hideElement('.MenuSharpIcon')
                showElement('.sidebar')
                showElement('.navbar-brand')
                setMainPadding('225px');
            }
        }
    }

    //hideElement('.MenuSharpIcon');

    //try {
    //    //Check if Previous URL is Home page
    //    if (user){    
        return (
            <div className='home'>
                <nav class="navbar navbar-expand-lg justify-content-between fixed-top">
                    {/* 
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    */}

                    <div class="navbar-brand"><a href="/home"><img src="logo_advisor_brand.png" width='150px' height='42px' alt='Arkeo Dashboard' /></a></div>
                    <div>
                        <div className='MenuOpenSharpIcon'><IconButton onClick={(e)=>handleClickBurger(0)}><MenuOpenSharpIcon fontSize="medium"/></IconButton></div>
                        <div className='MenuSharpIcon'><IconButton onClick={(e)=>handleClickBurger(1)}><MenuSharpIcon fontSize="medium" /></IconButton></div>
                    </div>
                    
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <div class="navbar-nav mr-auto">
                            <div className="welcome">Welcome back {props.userName}!</div>
                            {/*
                            <Link to="/"><div class="nav-item nav-link active">Data</div></Link>
                            <div class="nav-item nav-link disabled" tabindex="-1">Reports</div>
                            */}
                        </div>
                    </div>
                    
                    {/* <div class="nav-item nav-link" > <Link to="/login" onClick={() => handleAuthentication()}>Logout</Link></div> */}
                    <div className='notifications'>
                        <div className='badgeDiv'><Badge badgeContent={5} color="primary"><MailOutlineIcon fontSize='small'/></Badge></div>
                        <div className='badgeDiv'><Badge badgeContent={1} color="secondary"><NotificationsNoneIcon fontSize='small' /></Badge></div>
                        <div className='badgeDiv'><Badge badgeContent={3} color="error"><EmojiFlagsIcon fontSize='small' /></Badge></div>
                    </div>
                    <div className='avatarName'>
                        <div><IconButton><Avatar alt={props.userName} src={props.profileData?.Path} className={classes.small}/></IconButton></div>
                        <div>{props.userName}</div>
                    </div>
                    <div><IconButton><SettingsIcon fontSize='medium' /></IconButton></div>
                </nav>


                <div class="container-fluid">
                    <div class="row">
                        <div className="sidebar">
                            <div className = 'menuList'>
                                <div className="menuListHeader">Main</div>
                                <div className="menuListItem" onClick={() => handleDisplaySection('Dashboard')}>
                                    <span className='menuListItemIcon'><DashboardOutlinedIcon fontSize='small' /></span><span className='menuListItemText'>Dashboard</span>
                                </div>
                                <div className="menuListItem" onClick={()=>handleDisplaySection('Profile')}>
                                    <span className='menuListItemIcon'><AccountCircleOutlinedIcon fontSize='small' /></span><span className='menuListItemText'>Account</span>
                                </div>
                                <div className="menuListItem" onClick={()=>handleClickExpand()}>
                                    <span className='menuListItemIcon'><MonetizationOnOutlinedIcon fontSize='small' /></span>
                                    <span className='menuListItemText'>Compensation</span>
                                    <span className='menuListItemMore'>{expandIcon}</span>
                                </div>
                                    {compensationSubMenu}
                                <div className="menuListItem"><span className='menuListItemIcon'></span><PeopleAltOutlinedIcon fontSize='small' /><span className='menuListItemText'>Clients</span></div>
                                <div className="menuListItem" onClick={() => handleDisplaySection('Hierarchy')}>
                                    <span className='menuListItemIcon'>
                                    </span><AccountTreeOutlinedIcon fontSize='small' /><span className='menuListItemText'>Team</span>
                                </div>

                                <div className="menuListHeader">Compliance</div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><PolicyOutlinedIcon fontSize='small' /><span className='menuListItemText'>Licenses</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><BorderColorOutlinedIcon fontSize='small' /><span className='menuListItemText'>Contracting</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><AssignmentIndOutlinedIcon fontSize='small' /><span className='menuListItemText'>KYC</span></div>
                                <div className="menuListHeader">Tools</div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><MailOutlineIcon fontSize='small' /><span className='menuListItemText'>Email</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><ContactPhoneOutlinedIcon fontSize='small' /><span className='menuListItemText'>Contacts</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><PlaylistAddCheckIcon fontSize='small' /><span className='menuListItemText'>Tasks</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><CalendarTodayIcon fontSize='small' /><span className='menuListItemText'>Calendar</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><SchoolOutlinedIcon fontSize='small' /><span className='menuListItemText'>Continuing Education</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><ViewListOutlinedIcon fontSize='small'/><span className='menuListItemText'>Forms</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><InsertDriveFileOutlinedIcon fontSize='small' /><span className='menuListItemText'>My Files</span></div>
                                <div className="menuListHeader">Support</div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><LiveHelpOutlinedIcon fontSize='small' /><span className='menuListItemText'>FAQ</span></div>
                                <div className="menuListItem"><span className='menuListItemIcon'></span><ContactMailOutlinedIcon fontSize='small' /><span className='menuListItemText'>Contact Us</span></div>
                                <div className="menuListDivider"></div><div className="menuListSpacer"></div>
                                <div className="menuListItem" onClick={() => handleAuthentication()}>
                                    <span className='menuListItemIcon'></span><ExitToAppOutlinedIcon fontSize='small' /><span className='menuListItemText'>Logout</span>
                                </div>
                                <div className="menuListSpacer"></div><div className="menuListDivider"></div>
                                <div className="menuListItem"><span className='menuListItemSupport'><AvatarOnline/></span></div>
                            </div>

                        </div>
                        <div class="container" style ={{paddingLeft:mainPadding}}>
                            <div className='sectionOne'>
                                <div className='highlightCard'>
                                    <div className='highlightCardIcon' style={{ backgroundColor: '#118b76' }}><MonetizationOnOutlinedIcon fontSize='large' color='white'/></div>
                                    <div className='highlightCardText'>
                                        <span className='highlightCardTextTitle'>INCOME</span>
                                        <span className='highlightCardTextContent'>$10K (YTD)</span>
                                        <span className='highlightCardTextContent'>$112K (To-Date)</span>
                                    </div>
                                </div>
                                <div className='highlightCard'>
                                    <div className='highlightCardIcon' style={{ backgroundColor: '#dd4b39' }}><WorkOutlineOutlinedIcon fontSize='large' color='white'/></div>
                                    <div className='highlightCardText'>
                                        <span className='highlightCardTextTitle'>PORTFOLIO</span>
                                        <span className='highlightCardTextContent'>10 (YTD)</span>
                                        <span className='highlightCardTextContent'>45 (To-Date)</span>
                                    </div>
                                </div>
                                <div className='highlightCard'>
                                    <div className='highlightCardIcon' style={{ backgroundColor: '#00c0ef' }}><GroupAddOutlinedIcon fontSize='large' color='white'/></div>
                                    <div className='highlightCardText'>
                                        <span className='highlightCardTextTitle'>PROGRESS TO NEXT PROMOTION</span>
                                        <div className='progressBadgeDiv'><ProgressStatus/></div>
                                    </div>
                                </div>
                                <div className='highlightCard' onClick={() => handleDisplaySection('Hierarchy')}>
                                    <div className='highlightCardIcon' style={{ backgroundColor: '#f39c12' }}><GroupAddOutlinedIcon fontSize='large' color='white'/></div>
                                    <div className='highlightCardText'>
                                        <span className='highlightCardTextTitle'>TEAM</span>
                                        <span className='highlightCardTextContent'>10 (YTD)</span>
                                        <span className='highlightCardTextContent'>45 (To-Date)</span>
                                    </div>
                                </div>
                            </div>
                            {displaySection}
                        </div>
                    </div>
                </div>
            </div>
        )
    //    } else
    //      return (<div>{history.push('/')}</div>)
    //}
    //return to LOGIN PAGE if direct access the Register URL or previous path is not Login page
    //catch (error) {
    //    return (<div>{history.push("/")}</div>)
    //}
}
export default Home
