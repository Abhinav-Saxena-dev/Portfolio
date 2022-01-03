import React from "react";

import './entries.style.scss';

const Entries = ({ticker, avg_buy, shares}) => (
    <div className="entry">
        <div className="entries">
            <div className="field">
                {ticker}
            </div>
            <div className="field">
                {avg_buy}
            </div>
            <div className="field">
                {shares}
            </div>
            <div className="field">
                Update
            </div>
            <div className="field">
                Delete
            </div>
        </div>
    </div>
);

export default Entries;