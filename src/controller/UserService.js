const User = require("../mongo/Schema/User/User");
 
const create = async (document) => {
  return await new User(document).save();
};
 
const read = async (id) => {
  return await User.findById(id);
};
 
const update = async (id, document) => {
  const user = await User.findById(id);
  user.set({ ...user.toObject(), ...document, updateAt: Date.now() });
  await user.save();
  return user;
};
 
const findOne = async (email) => {
  return await User.findOne(email);
};
 
const find = async (query) => {
  return await User.find(query);
};
 
const remove = async (id) => {
  const result = await User.findByIdAndRemove(id);
  return result !== null;
};
 
module.exports = {
  create,
  read,
  findOne,
  find,
  update,
  remove,
};
