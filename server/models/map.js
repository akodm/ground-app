module.exports = (sequelize, DataTypes) => {
    const Map = sequelize.define("map", {
        id : {
            type: DataTypes.INTEGER,     // 구분용
            primaryKey : true,
            autoIncrement: true
        },
        title : {
            type: DataTypes.STRING,      // 제목 혹은 이름
        },
        content : {
            type: DataTypes.TEXT,      // 간단 설명
        },
        cate : {
            type: DataTypes.STRING,      // 분류 태그
        },
        lat : {
            type: DataTypes.DOUBLE,      // 위도
        },
        lng : {
            type: DataTypes.DOUBLE,      // 경도
        },
        url : {
            type: DataTypes.STRING,      // 페이지 불러오기 위함
        },
        place_id : {
            type: DataTypes.STRING,      // 장소 고유 아이디
        }
    });
    return Map;
};