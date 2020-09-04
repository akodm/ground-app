import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function LoadMask(props) {
    const { load } = props;
    return load ? (
        <div className="loadmask"><CircularProgress /></div>
    ) : <div></div>
}

export default LoadMask;