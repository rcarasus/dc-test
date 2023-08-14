import React from 'react'
import "./Footerplain.css"

function Footerplain() {
    const today = new Date();

    return (
    <div className="footerplain">
        <div className='footer__container'>            
            <hr />
            <div className="footer_text">
                <div className="footer__line1">
                    <a href='/Conditions' target='_blank'>Conditions of Use</a><a href='/Privacy' target='_blank'>Privacy Notice</a><a href='/FAQ' target='_blank'>Help </a>
                </div>
                <div className="footer__line2">
                        © {(today.getFullYear())}, <a href='https://arkeofinancialservices.com' target='_blank'>ArkeoFinancialServices.com</a>, Powered by <a href='https://promptsystem.com' target='_new'>PromptSystem.com</a>
                </div>
            </div>
        </div>
    </div>
    )}

export default Footerplain
