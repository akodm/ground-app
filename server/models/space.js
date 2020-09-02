module.exports = (sequelize, DataTypes) => {
    const Space = sequelize.define("space", {
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
        lat : {
            type: DataTypes.DOUBLE,      // 위도
        },
        lng : {
            type: DataTypes.DOUBLE,      // 경도
        },
    });
    Space.associate = function(models) {

    }
    return Space;
};