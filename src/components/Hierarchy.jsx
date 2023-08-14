import React, { useState, useEffect} from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import './Hierarchy.css';
import user from './user.png';
import { Avatar } from '@material-ui/core';

function Hierarchy({pAFSCode}) {
    const [parent,setParent] = useState([]);
    const [children,setChildren] = useState([]);
    const [disp,setDisp] = useState([]);
    useEffect(() => {
        loadCompensation(pAFSCode);
        return(() => {
            setParent([]);
            setChildren([]);
            setDisp([]);
        });
    },[]);

    //GraphQL address for profile API
    const compensationURI = new ApolloClient({
        uri: 'http://localhost:5000/compensation',
        cache: new InMemoryCache()
    });

    const toggleDisp = (code) => {
        setDisp({...disp, [code] : disp[code] == 'none' ? 'block' : 'none'});
        //setCompensation(loadCompensation(pAFSCode));
    }

    const currencyFormat = (symbol, num) => {
        return symbol + parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const loadCompensation = (code, is_children = false, parent = '') => {
        compensationURI.query({
            query: gql`
            query compensationQuery{
                compensation (pAFSCode: "${code}"){
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
                      Downline{
                        AFSCode
                    }
                }
            }
        `
        })
        .then((result) => {
                var data = result.data;
                
                if(!is_children){
                    setParent([data.compensation]);
                    var c_disp = disp;
                    c_disp[data.compensation.AFSCode] = 'block';
                    setDisp(c_disp);
                    data.compensation.Downline.map( (row) => {
                        loadCompensation(row.AFSCode, true, data.compensation.AFSCode);
                    });
                }else{
                    setChildren(children => [...children,{ data: data.compensation, parent: parent }]);
                    var c_disp = disp;
                    c_disp[data.compensation.AFSCode] = 'none';
                    setDisp(c_disp);
                    data.compensation.Downline.map( (row) => {
                        loadCompensation(row.AFSCode, true, data.compensation.AFSCode);
                    });
                }

            }
        );

    };

    const renderChildren = (parent) => {
        var current_children = children.filter((e) => {
            return e.parent === parent;
        });
        if(current_children){
            return (
                current_children.map(row => 
                <li key={'pc'+row.data.AFSCode}>
                    <div className="row g-0">
                        <div className="col-md-1">
                        {row.data.DownlineCount > 0 ? <a href='#' onClick={() => toggleDisp(row.data.AFSCode)}><i className={disp[row.data.AFSCode] == 'none' ? 'arrow right' : 'arrow down'}></i></a> : ""}
                        <Avatar src={!row.data.Path ? user : row.data.Path} className={disp[row.data.AFSCode] == "none" ? "profile" : "profile active"}
                        onClick={() => toggleDisp(row.data.AFSCode)}
                      />
                        {/* <img src={user} className="profile" /> */}
                        
                        </div>
                        <div className="col-md-6">
                            <strong className="text-success">{row.data.NAME}</strong> <small className="text-secondary">- {row.data.LEVEL}</small><br></br>
                            <small className="text-secondary" style={{'paddingRight': '20px'}}>{row.data.AFSCode}</small><span className="badge bg-success">Rate: {row.data.RATE}%</span> <span className="badge bg-success">LTI: {currencyFormat('$',row.data.LTI)}</span> <span className="badge bg-success">YTD: {currencyFormat('$',row.data.YTD)}</span>
                        </div>
                    </div>
                    <ul style={{'display': disp[row.data.AFSCode]}}>
                        {row.data.DownlineCount > 0 ? renderChildren(row.data.AFSCode) : ''}
                    </ul>
                </li>
                )
            );
        }
    }

    useEffect(() => {
    },[children]);

    return (
        <>  
           {
            parent.map(row => 
                    <ul key={'ulp'+row.AFSCode} className="tree mt-3">
                        <li key={'pc'+row.AFSCode}>
                            <div className="row g-0">
                                <div className="col-md-1">
                      {row.DownlineCount > 0 ? <a href='#' onClick={() => toggleDisp(row.AFSCode)}><i className={disp[row.AFSCode] == 'none' ? 'arrow right' : 'arrow down'}></i></a> : ""}
                      <Avatar src={!row.Path ? user : row.Path} className="profile" onClick={() => toggleDisp(row.AFSCode)}/>
                      {/*<img src={user} className="profile" />*/}
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-success">{row.NAME}</strong> <small className="text-secondary">- {row.LEVEL}</small><br></br>
                                    <small className="text-secondary" style={{'paddingRight': '20px'}}>{row.AFSCode}</small><span className="badge bg-success">Rate: {row.RATE}%</span> <span className="badge bg-success">LTI: {currencyFormat('$',row.LTI)}</span> <span className="badge bg-success">YTD: {currencyFormat('$',row.YTD)}</span>
                                </div>
                            </div>
                            <ul style={{'display': disp[row.AFSCode]}}>
                                {renderChildren(row.AFSCode)}
                            </ul>
                        </li>    
                    </ul> 
                )
            }
        </>
    )
}

export default Hierarchy


/*
import React, { useState, useEffect } from "react";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import "./Hierarchy.css";
import user from "./user.png";
import { ApolloProvider, Query } from "react-apollo";
import { Avatar } from "@material-ui/core";

function Hierarchy({ pAFSCode }) {
  const [compensation, setCompensation] = useState([]);
  const [disp, setDisp] = useState({});
  useEffect(() => {
    setCompensation(loadCompensation(pAFSCode));
  }, [disp]);

  const compensationURI = new ApolloClient({
    uri: "http://localhost:5000/compensation",
  });
    
  var compensationQuery = gql`
        query compensationQuery{
            compensation (pAFSCode: "${pAFSCode}"){
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
                  Downline{
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
        }
    `;
    
  const addULDisp = (code) => {
    var ldisp = disp;
    if (ldisp[code] == null) {
      ldisp[code] = "none";
      setDisp(ldisp);
    }
  };

  const toggleDisp = (code) => {
    var ldisp = disp;
    ldisp[code] = ldisp[code] == "none" ? "block" : "none";
    setDisp(ldisp);
    setCompensation(loadCompensation(pAFSCode));
  };

  const currencyFormat = (symbol, num) => {
    return (
      symbol +
      parseFloat(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  };

  const loadCompensation = (code, is_children = false) => {
    compensationQuery = gql`
            query compensationQuery{
                compensation (pAFSCode: "${code}"){
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
                      Downline{
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
            }
        `;
    
    return (
      <Query query={compensationQuery}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <ul>
                <li>Loading...</li>
              </ul>
            );
          if (error) console.log(error);
          if (data.compensation) {
            if (!is_children) {
              addULDisp(data.compensation.AFSCode);
              return (
                <ul className="tree mt-3">
                  <li key={data.compensation.AFSCode}>
                    <div className="row auto">
                      <div className="col-auto">
                        {data.compensation.Downline.length > 0 ? (
                          <a
                            href="#"
                            onClick={() =>
                              toggleDisp(data.compensation.AFSCode)
                            }
                          >
                            <i
                              className={
                                disp[data.compensation.AFSCode] == "none"
                                  ? "arrow right"
                                  : "arrow down"
                              }
                            ></i>
                          </a>
                        ) : (
                          ""
                        )}{" "}
                        <Avatar
                          src={
                            !data.compensation.Path
                              ? user
                              : data.compensation.Path
                          }
                          className="profile"
                        />
                      </div>
                      <div className="col-auto">
                        <strong className="text-success">
                          {data.compensation.NAME}
                        </strong>{" "}
                        <small className="text-secondary">
                          - {data.compensation.LEVEL}
                        </small>
                        <br></br>
                        <small
                          className="text-secondary"
                          style={{ "padding-right": "20px" }}
                        >
                          {data.compensation.AFSCode}
                        </small>
                        <span className="badge bg-success">
                          Rate: {data.compensation.RATE}%
                        </span>{" "}
                        <span className="badge bg-success">
                          LTI: {currencyFormat("$", data.compensation.LTI)}
                        </span>{" "}
                        <span className="badge bg-success">
                          YTD: {currencyFormat("$", data.compensation.YTD)}
                        </span>
                      </div>
                    </div>
                    <ul style={{ display: disp[data.compensation.AFSCode] }}>
                      {data.compensation.Downline.length > 0
                        ? renderList(data.compensation.Downline)
                        : ""}
                    </ul>
                  </li>
                </ul>
              );
            } else {
              addULDisp(data.compensation.AFSCode);
              return (
                <li
                  key={data.compensation.AFSCode}
                  style={{ display: "list-item" }}
                >
                  <div className="row auto">
                    <div className="col-auto">
                      {data.compensation.Downline.length > 0 ? (
                        <a
                          href="#"
                          onClick={() => toggleDisp(data.compensation.AFSCode)}
                        >
                          <i
                            className={
                              disp[data.compensation.AFSCode] == "none"
                                ? "arrow right"
                                : "arrow down"
                            }
                          ></i>
                        </a>
                      ) : (
                        ""
                      )}{" "}
                      <Avatar
                        src={
                          !data.compensation.Path
                            ? user
                            : data.compensation.Path
                        }
                        className={
                          disp[data.compensation.AFSCode] == "none"
                            ? "profile"
                            : "profile active"
                        }
                        onClick={() => toggleDisp(data.compensation.AFSCode)}
                      />
                    </div>
                    <div className="col-auto">
                      <strong className="text-success">
                        {data.compensation.NAME}
                      </strong>
                      <small className="text-secondary">
                        - {data.compensation.LEVEL}
                      </small>
                      <br></br>
                      <small
                        className="text-secondary"
                        style={{ "padding-right": "20px" }}
                      >
                        {data.compensation.AFSCode}
                      </small>
                      <span className="badge bg-success">
                        Rate: {data.compensation.RATE}%
                      </span>{" "}
                      <span className="badge bg-success">
                        LTI: {currencyFormat("$", data.compensation.LTI)}
                      </span>{" "}
                      <span className="badge bg-success">
                        YTD: {currencyFormat("$", data.compensation.YTD)}
                      </span>
                    </div>
                  </div>
                  <ul
                    className="tree mt-3"
                    style={{ display: disp[data.compensation.AFSCode] }}
                  >
                    {data.compensation.Downline.length > 0
                      ? renderList(data.compensation.Downline)
                      : ""}
                  </ul>
                </li>
              );
            }
          } else
            return (
              <ul>
                <li>Profile not Found</li>
              </ul>
            );
        }}
      </Query>
    );
  };

  const renderList = (data) => {
    if (data.length > 0) {
      return data.map((row) => loadCompensation(row.AFSCode, true));
    } else return false;
  };

  return (
    <ApolloProvider client={compensationURI}>
      <>{compensation}</>
    </ApolloProvider>
  );
}

export default Hierarchy;
*/