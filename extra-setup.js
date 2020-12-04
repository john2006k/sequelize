const applyExtraSetup = (sequelize) => {
    const { User, File} = sequelize.models;
    User.hasMany(File, {
        onDelete: "RESTRICT"
    });
    File.belongsTo(User);
}

module.exports = applyExtraSetup;