var User = require('../models/user');//here is the schema of db...User is exported schema from model/user 
/**
 * data inserting
 * @param {object} data 
 */
module.exports.createUser = function(data) {
    var newUser = new User(data).save();

    return newUser;
};

/**
 * view data
 * @param {*} query 
 */
module.exports.getUsers = function(query = {}, project = {}) {
    return User.find(query, project).exec();
};

 /**
  * view one data
  * @param {*} query 
  */
module.exports.getUser = function(query = {}) {
    return User.findOne(query).lean().exec();//lean....load document as a plain javascript

};

/**
 * update
 * @param {*} query 
 * @param {*} data 
 */
module.exports.updateUser = function(query = {}, data = {}) {
return User.update(query, data).exec();
};

module.exports.paginateUser = function(query = {}, options= {}) {
	return User.paginate(query, options);
};