import React, { useState, useEffect} from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactPaginate from 'react-paginate';


function Profile() {
    const init_profileData = {
        AFSCode: '',
        LastName: '',
        FirstName: '',
        Address: '',
        City: '',
        Province: '',
        Postal: '',
        CorporateEmail: '',
        PersonalEmail: '',
        DOB: '',
        Mobile: '',
        DateStarted: '',
        Status: '',
        Upline: '',
        Location: '', 
        Path: '',
    }
    const [profileData,setProfileData] = useState(init_profileData);
    const [pageCount,setPageCount] = useState(0);
    const [perPage] = useState(10);
    const [submitDisable,setSubmitDisable] = useState(true);
    const [showModal,setShowModal] = useState([]);
    const [codes,setCodes] = useState([]);
    const [profiles,setProfile] = useState([]);
    useEffect(() => {
        loadProfile(0);
        loadCodes();
    },[])

    useEffect(() => {
        var found = false;
        Object.entries(profileData).forEach(([key, value]) => {
            if(value == ''){
                found = true;
                return;
            }
        });
        setSubmitDisable(found);
    },[profileData]);
    
    //GraphQL address for profile API
    const profileURI = new ApolloClient({
        uri: 'http://localhost:5000/profile',
        cache: new InMemoryCache()
    });
    
    //load all profiles
    const loadProfile = (currentPage) => {
        profileURI
        .query({
            query: gql`
                    query profileQuery{
                        profiles (offset: ${((currentPage)*perPage)},limit: ${perPage}){
                            AFSCode
                            LastName
                            FirstName
                            Address
                            City
                            Province
                            Postal
                            CorporateEmail
                            PersonalEmail
                            DOB
                            Mobile
                            DateStarted
                            Status
                            Upline
                            Location
                            Path
                        }
                    }
                    `
        })
        .then(result => {
                var data = result.data;
                setProfile(data.profiles);
            }
        );
    };

    //load all codes for dropdown
    const loadCodes = () => {
        profileURI
        .query({
            query: gql`
                query profileQuery{
                    profile_codes {
                        Codes
                        DataCount
                    }
                }
            `
        })
        .then(result => {
                var data = result.data;
                setCodes(data.profile_codes.Codes);
                setPageCount(Math.ceil(data.profile_codes.DataCount / perPage));
            }
        );
    };

    //select profile on dropdown
    const selectProfile = (selectedCode) => {
        profileURI
        .query({
            query: gql`
                query profileQuery{
                    profile (pAFSCode: "${selectedCode}"){
                        AFSCode
                        LastName
                        FirstName
                        Address
                        City
                        Province
                        Postal
                        CorporateEmail
                        PersonalEmail
                        DOB
                        Mobile
                        DateStarted
                        Status
                        Upline
                        Location
                        Path
                    }
                }
                `
        })
        .then(result => {
                var data = result.data;
                setProfile([data.profile]);
            }
        );
    };

    //CRUD
    const create = (AFSCode, profileData) => {
        profileURI
        .query({
            query: gql`
                query profileQuery{
                    profile_create (
                            AFSCode: "${AFSCode}",
                            LastName: "${profileData.LastName}",
                            FirstName: "${profileData.FirstName}",
                            Address: "${profileData.Address}",
                            City: "${profileData.City}",
                            Province: "${profileData.Province}",
                            Postal: "${profileData.Postal}",
                            CorporateEmail: "${profileData.CorporateEmail}",
                            PersonalEmail: "${profileData.PersonalEmail}",
                            DOB: "${profileData.DOB}",
                            Mobile: "${profileData.Mobile}",
                            DateStarted: "${profileData.DateStarted}",
                            Status: "${profileData.Status}",
                            Upline: "${profileData.Upline}",
                            Location: "${profileData.Location}",
                            Path: "${profileData.Path}"
                        ){
                        AFSCode
                        LastName
                        FirstName
                        Address
                        City
                        Province
                        Postal
                        CorporateEmail
                        PersonalEmail
                        DOB
                        Mobile
                        DateStarted
                        Status
                        Upline
                        Location
                        Path
                    }
                }
                `
        })
        .then(result => {
                var data = result.data;
                setProfileData(data.profile_create);
            }
        );
    }
    const read = (AFSCode) => {
        profileURI
        .query({
            query: gql`
                    query profileQuery{
                        profile (pAFSCode: "${AFSCode}"){
                            AFSCode
                            LastName
                            FirstName
                            Address
                            City
                            Province
                            Postal
                            CorporateEmail
                            PersonalEmail
                            DOB
                            Mobile
                            DateStarted
                            Status
                            Upline
                            Location
                            Path
                        }
                    }
                    `
        })
        .then(result => {
                var data = result.data;
                setProfileData(data.profile);
            }
        );
    };
    const update = (AFSCode, profileData) => {
        if(window.confirm("Are you sure you want to update this?")){
            profileURI
            .query({
                query: gql`
                    query profileQuery{
                        profile_update (
                                AFSCode: "${AFSCode}",
                                LastName: "${profileData.LastName}",
                                FirstName: "${profileData.FirstName}",
                                Address: "${profileData.Address}",
                                City: "${profileData.City}",
                                Province: "${profileData.Province}",
                                Postal: "${profileData.Postal}",
                                CorporateEmail: "${profileData.CorporateEmail}",
                                PersonalEmail: "${profileData.PersonalEmail}",
                                DOB: "${profileData.DOB}",
                                Mobile: "${profileData.Mobile}",
                                DateStarted: "${profileData.DateStarted}",
                                Status: "${profileData.Status}",
                                Upline: "${profileData.Upline}",
                                Location: "${profileData.Location}",
                                Path: "${profileData.Path}"
                            ){
                            AFSCode
                            LastName
                            FirstName
                            Address
                            City
                            Province
                            Postal
                            CorporateEmail
                            PersonalEmail
                            DOB
                            Mobile
                            DateStarted
                            Status
                            Upline
                            Location
                            Path
                        }
                    }
                    `
            })
            .then(result => {
                    var data = result.data;
                    if(data.profile_update == null) alert('AFSCode does not exist!');
                    else setProfileData(data.profile_update);
                }
            );
        }
    }
    const deleted = (AFSCode) => {
        if(window.confirm("Are you sure you want to delete this?")){
            profileURI
            .query({
                query: gql`
                        query profileQuery{
                            profile_delete (AFSCode: "${AFSCode}")
                        }
                        `
            })
            .then(result => {
                    var data = result.data;
                    if(data.profile_delete == null) alert('AFSCode does not exist!');
                    if(data.profile_delete == true) alert("Deleted");
                }
            );
        }
    };
    //END OF CRUD
    
    //Confirm Modal
    const confirm = (isUpdate) =>{
        setShowModal(<div className="modal show fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{"display":"block"}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Message</h5>
              <button type="button" className="btn-close"  onClick={() => setShowModal(<></>)}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to {isUpdate ? 'update' : 'delete'} this record
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={() => setShowModal(<></>)} autoFocus={true}>No</button>
              <button type="button" className="btn btn-success" onClick={() => isUpdate ? update(profileData.AFSCode,profileData) : deleted(profileData.AFSCode)}>Yes</button>
            </div>
          </div>
        </div>
      </div>);
    }

    //Handle Input Change
    const handleChange = (e) => {
        var { name, value, checked } = e.target
        setProfileData({ ...profileData, [name]: value });
    };

    return (
        <div className="container-fluid">
            {showModal}
            <div className="row pt-3">
                <div className="col-md-4 col-lg-4 col-sm-4">
                    <h3>Profile Form</h3>
                </div>
                <div className="col-md-8 col-lg-8 col-sm-8">
                    <label>Code</label>
                    <select className="form-select"
                        onChange={(e) => { e.target.value ? selectProfile(e.target.value) : loadProfile(0)}}
                        value={""}
                        >
                        <option value="">View All</option>
                        {codes.map(row => <option key={row}>{row}</option>)}
                    </select>
                </div>
            </div>
            <div className="row pt-3">
                <div className="col-md-4 col-lg-4 col-sm-4">
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="AFSCode" placeholder="AFSCode" aria-label="AFSCode" aria-describedby="basic-addon1" onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="LastName" placeholder="LastName" aria-label="LastName" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="FirstName" placeholder="FirstName" aria-label="FirstName" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Address" placeholder="Address" aria-label="Address" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="City" placeholder="City" aria-label="City" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Province" placeholder="Province" aria-label="Province" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Postal" placeholder="Postal" aria-label="Postal" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="CorporateEmail" placeholder="CorporateEmail" aria-label="CorporateEmail" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="PersonalEmail" placeholder="PersonalEmail" aria-label="PersonalEmail" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label>DOB</label>
                        <input type="date" className="form-control" name="DOB" placeholder="DOB" aria-label="DOB" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Mobile" placeholder="Mobile" aria-label="Mobile" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label>DateStarted</label>
                        <input type="date" className="form-control" name="DateStarted" placeholder="DateStarted" aria-label="DateStarted" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Status" placeholder="Status" aria-label="Status" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Upline" placeholder="Upline" aria-label="Upline" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Location" placeholder="Location" aria-label="Location" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="input-group mb-2">
                        <input type="text" className="form-control" name="Path" placeholder="Path" aria-label="Path" aria-describedby="basic-addon1"  onChange={handleChange} />
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-success" onClick={() => create(profileData.AFSCode,profileData)} disabled={submitDisable}>Create</button>
                        <button type="button" className="btn btn-primary" onClick={() => read(profileData.AFSCode)} disabled={submitDisable}>Read</button>
                        <button type="button" className="btn btn-warning" onClick={() => confirm(true)} disabled={submitDisable}>Update</button>
                        <button type="button" className="btn btn-danger" onClick={() => confirm(false)} disabled={submitDisable}>Delete</button>
                    </div>
                </div>
                <div className="col-md-8 col-lg-8 col-sm-8">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>AFSCode</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Province</th>
                                <th>Postal</th>
                                <th>Corporate Email</th>
                                <th>Personal Email</th>
                                <th>Date of Birth</th>
                                <th>Mobile</th>
                                <th>Date Started</th>
                                <th>Status</th>
                                <th>Upline</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map(row => 
                            <tr key={row.AFSCode}>
                                <td>{row.AFSCode}</td>
                                <td>{row.FirstName} {row.LastName}</td>
                                <td>{row.Address}</td>
                                <td>{row.City}</td>
                                <td>{row.Province}</td>
                                <td>{row.Postal}</td>
                                <td>{row.CorporateEmail}</td>
                                <td>{row.PersonalEmail}</td>
                                <td>{row.DOB}</td>
                                <td>{row.Mobile}</td>
                                <td>{row.DateStarted}</td>
                                <td>{row.Status}</td>
                                <td>{row.Upline}</td>
                                <td>{row.Location}</td>
                            </tr>)
                            }
                        </tbody>
                    </table>
                    <nav>
                        <ReactPaginate
                        previousLabel={"Prev"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        activeClassName={"active"}
                        activeLinkClassName={"page-link"}
                        onPageChange={(e) => { loadProfile(e.selected)}}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}/>
                    </nav> 
                </div>
            </div>
        </div>
    )
}

export default Profile
