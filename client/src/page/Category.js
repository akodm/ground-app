import React from 'react';

import ListItem from '../components/CategoryList';

function Category(props) {
    const { mapArr } = props;
    return (
        <div className="category">
            <div className="category-guide">카테고리별로 분류된 리스트를 클릭해 지도에서 확인해보세요.</div>
            <div className="category-container">
                {
                    mapArr && mapArr.map((data, i) => {
                        return <ListItem 
                            key={i}
                            count={data.count}
                            cate={data.cate}
                            {...props}
                        />
                    })
                }
            </div>
        </div>
    );
}

export default Category;