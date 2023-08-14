import React from 'react'
import Hierarchy from './Hierarchy';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';

function Myteam(props) {
    return (
        <div style={{
            background: 'white',
            paddingTop: '15px',
            width: '100%',
            borderTop: '3px solid #118b76',
            borderBottom: '1px solid #f4f4f4',
            maxHeight: props.height,
            overflowY: 'auto',
            overflowx: 'auto'
        }}>
            <div style={{
                display:'block',
                width: '100%',
                padding:'15px',
            }}>
                <h4><AccountTreeOutlinedIcon fontSize='large' /> Hierarchy</h4>
                {console.log(props.AFSCode)}
                <Hierarchy pAFSCode={props._AFSCode} />
            </div>
        </div>
    )
}

export default Myteam
