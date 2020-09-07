import React from 'react';

function FindPlace(props) {
    const { setFindOpen } = props;

    return (
        <div className="addmarker findplace" onClick={() => setFindOpen(true)}>
            <div>{props.text}</div>
        </div>
    );
}

export default FindPlace;