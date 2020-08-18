import React from 'react';

function Button(props) {
    return (
        <div 
            className={`button ${props.className || ""}`} 
            style={props.style || {}} 
            onClick={() => props.onClick && props.onClick()}
        >
            {props.text || "Not"}
        </div>
    );
}

export default Button;