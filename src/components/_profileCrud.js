import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

//GraphQL address for profile API
const profileURI = new ApolloClient({
    uri: 'http://localhost:5000/profile',
    cache: new InMemoryCache()
});

//CRUD
const create = (AFSCode, profileData, setProfileData) => {
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
                        Path: "${profileData.Path}",
                        fUID: "${profileData.fUID}",
                        Education: """${profileData.Education}""",
                        Skills: """${profileData.Skills}""",
                        Note: """${profileData.Note}"""
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
                    fUID
                    Education
                    Skills
                    Note
                }
            }
            `
    })
    .then(result => {
            var data = result.data;
            setProfileData(data.profile_create);
        }
    );
};


const clearProfileCache = () => {
    profileURI.cache.reset()
};

const search = (AFSCode, setFoundCode) => {
    profileURI
        .query({
            query: gql`
                query profileQuery{
                    profile_code (AFSCode: "${AFSCode}"){
                        AFSCode
                    }
                }
                `
        })
        .then(result => {
            var data = result.data;
            setFoundCode(data.profile_code);
        }
        )
};

const read = (fUID, setProfileData) => {
    profileURI
        .query({
            query: gql`
                query profileQuery{
                    profile (fUID: "${fUID}"){
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
                        fUID
                        Education
                        Skills
                        Note
                    }
                }
                `
        })
        .then(result => {
            var data = result.data;
            setProfileData(data.profile);
        }
        )
        .catch(error => {
            console.log(error);
        });
};

const update = (AFSCode, profileData, setProfileData) => {
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
                        Path: "${profileData.Path}",
                        fUID: "${profileData.fUID}",
                        Education: """${profileData.Education}""",
                        Skills: """${profileData.Skills}""",
                        Note: """${profileData.Note}"""
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
                    fUID
                    Education
                    Skills
                    Note
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
const deleted = (AFSCode, setProfileData) => {
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
};
//END OF CRUD

export {create, read, update, deleted, search, clearProfileCache}
