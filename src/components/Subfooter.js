import React from 'react'
import "./Subfooter.css"

function SubFooter() {
    return (
        <div className="subfooter__container">
            {/* LOWER SECTION */}
            <div className="subfooterB__container">
                {/* LOWER SECTION B: FOOTER */}
                <div className="lowerSectionB__container">
                    <div clasName="lowerSectionB__texts">
                        <a className="footer_link" href="/conditions">Conditions of Use</a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <a className="footer_link" href="/privacy">Privacy Notice</a>&nbsp;&nbsp;&nbsp;&nbsp;© 2021,&nbsp;
                        <a className="footer_linkX" target='_blank' href="https://arkeofinancialservices.com">ArkeoFinancialServices.com</a>,&nbsp;Powered by &nbsp;
                        <a className="footer_linkX" target='_blank' href="https://promptsystem.com">PromptSystem.com</a>
                </div>
                </div>
            </div>
        </div>
    )
    }

export default SubFooter
