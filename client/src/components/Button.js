import React from 'react';

function Button(props) {
    const { onClick } = props;
    return (
        <div 
            className={`button ${props.className || ""}`} 
            style={props.style || {}} 
            onClick={() => onClick && onClick()}
        >
            {props.text || "Not"}
        </div>
    );
}

export default Button;