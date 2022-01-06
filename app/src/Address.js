import React, { useState } from 'react'

import './Address.css';

function Address(props) {
    const [address] = useState(props.value);

    const copy = () => {
        navigator.clipboard.writeText(address);
    }

    return (
        <span className="Address">
            <span className="Address-value">{address.substr(0, 6)}...{address.substr(address.length - 5, 5)}</span>
            <img src="/img/copy.svg" className="Address-copy" onClick={copy} alt="copy" title="copy address"></img>
        </span>
    );
}

export default Address;