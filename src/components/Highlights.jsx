import React from 'react';
import './Highlights.css';
import Myteam from './Myteam';

function Highlights(props) {
    return (
        <div className='highlights'>
            <h3>Highlights</h3>
            <div>
                {/* <Myteam _AFSCode={props.AFSCode} height='500px' /> */}
            </div>

            <div style={{
                background: 'white',
                paddingTop: '15px',
                width: '100%',
                borderTop: '3px solid #118b76',
                borderBottom: '1px solid #f4f4f4',
                maxHeight: '500px',
                overflowY: 'auto',
                overflowx: 'auto',
                display:'flex'
            }}>
                <div style={{
                display:'block',
                width: '59%',
                }}>
                    <img src='images/todo_.jpg' />
                </div>
                <div style={{
                display:'block',
                }}>
                    <img src='images/sales_.jpg' />
                </div>
            </div>

            <div style={{
                background: 'white',
                paddingTop: '15px',
                width: '100%',
                borderTop: '3px solid #118b76',
                borderBottom: '1px solid #f4f4f4',
                maxHeight: '500px',
                overflowY: 'auto',
                overflowx: 'auto',
                display:'flex'
            }}>
                <div style={{
                display:'block',
                width: '59%',
                }}>
                    <img src='images/qemail_.jpg' />
                </div>
                <div style={{
                display:'block',
                }}>
                    <img src='images/calendar_.jpg' />
                </div>
            </div>
        </div>
    )
}

export default Highlights
