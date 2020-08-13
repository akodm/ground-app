module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id : {
            type: DataTypes.INTEGER,     // 구분용
            primaryKey : true,
            autoIncrement: true
        },
        email : {
            type: DataTypes.STRING,      // 이메일
            allowNull: false
        }
    });
    User.associate = function(models) {

    }
    return User;
};