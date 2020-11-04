import React from 'react';

function CategoryList(props) {
    const { cate, count } = props;

    function listClick() {
        if(props.history) {
            props.history.push(`/map/${cate}`);
        } else {
            alert("페이지에 문제가 있습니다.");
            window.location.href = "/";
        }
    }

    return (
        <div className="cagetorylist" onClick={listClick}>
            <div className="categorylist-title">{cate}</div>
            <div className="categorylist-count">{count}개</div>
        </div>
    );
}

export default CategoryList;