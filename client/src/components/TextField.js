import React from 'react';

function TextField(props) {
    return (
        <div className="textfield" style={props.style || {}}>
            <input
                type={props.type || "text"}
                value={props.value}
                name={props.name}
                onChange={(e) => props.onChange(e.target.value)}
                onPaste={(e) => props.onChange(e.target.value)}
                placeholder={props.placeholder}
                style={props.textStyle || {}}
                maxLength={props.maxLength}
                className={`textfield-input ${props.className}`}
            ></input>
        </div>
    );
}

export default TextField;