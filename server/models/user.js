module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id : {
            type: DataTypes.INTEGER,     // 구분용
            primaryKey : true,
            autoIncrement: true
        },
        name : {
            type: DataTypes.STRING,      // 닉네임
            allowNull: false
        },
        pass : {
            type: DataTypes.STRING,      // 비밀번호
            allowNull: false
        },
        ref : {
            type: DataTypes.STRING,      // 리프레쉬 토큰
        },
        acs : {
            type: DataTypes.STRING,      // 액세스 토큰
        },
    });
    User.associate = function(models) {

    }
    return User;
};