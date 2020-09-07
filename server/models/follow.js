module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define("follow", {
        id : {
            type: DataTypes.INTEGER,     // 구분용
            primaryKey : true,
            autoIncrement: true
        },
        user_info : {
            type: DataTypes.JSON,      // 팔로우한 유저 정보
            allowNull: false
        },
        target_info : {
            type: DataTypes.JSON,      // 타겟의 유저 정보
            allowNull: false
        },
        user_id : {
            type: DataTypes.STRING,      // 팔로우한 유저 아이디
            allowNull: false
        },
        target_id : {
            type: DataTypes.STRING,      // 타겟의 유저 아이디
            allowNull: false
        },
    });

    return Follow;
};