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
        lat : {
            type: DataTypes.STRING,      // 위도
        },
        log : {
            type: DataTypes.STRING,      // 경도
        },
    });
    Space.associate = function(models) {

    }
    return Space;
};