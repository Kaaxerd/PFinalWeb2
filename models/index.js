const Models = {
    usersModel: require('./nosql/users'),
    clientsModel: require('./nosql/clients'),
    companiesModel: require('./nosql/company'),
    projectsModel: require('./nosql/projects')
}

module.exports = Models;