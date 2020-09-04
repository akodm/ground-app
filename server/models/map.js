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
        lat : {
            type: DataTypes.DOUBLE,      // 위도
        },
        lng : {
            type: DataTypes.DOUBLE,      // 경도
        },
        url : {
            type: DataTypes.STRING,      // 페이지 불러오기 위함
        }
    });
    return Map;
};