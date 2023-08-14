import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

//GraphQL address for profile API
const compensationURI = new ApolloClient({
    uri: 'http://localhost:5000/compensation',
    cache: new InMemoryCache()
});

//CRUD
const readCompensation = (AFSCode, setCompensationData) => {
    compensationURI
    .query({
        query: gql`
                query compensationQuery{
                    compensation (pAFSCode: "${AFSCode}"){
                        AFSCode
                        NAME
                        Path
                        LTI
                        LEVEL
                        YTD
                        RATE
                        RESFUND
                        BALANCE
                        DownlineCount
                    }
                }
                `
    })
    .then(result => {
            var data = result.data;
            setCompensationData(data.compensation);
        }
    );
};

//END OF CRUD

export {readCompensation}
