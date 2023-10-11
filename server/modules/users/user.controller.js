const Model = require("./user.model");
const bcrypt = require("bcrypt");

const create = async (payload) => {
  const { password, ...rest } = payload;
  rest.password = await bcrypt.hash(password, +process.env.SALT_ROUND);
  return Model.create(rest);
};

const getById = (id) => {
  return Model.findOne({ _id: id });
};

const list = async (limit, page, search) => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 5;
  const query = [];
  // return Model.find(query).skip((pageNum-1)*limit).limit(limit);
  // Filters
  if (search?.name) {
    query.push({
      $match: { name: new RegExp(search?.name, "gi") },
    });
  }
  if (search?.role) {
    query.push({
      $match: { roles: [search?.role] },
    });
  }

  query.push(
    {
      $sort: {
        created_at: -1,
      },
    },
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (pageNum - 1) * size,
          },
          {
            $limit: size,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        data: 1,
        total: 1,
      },
    },
    {
      $project: {
        "data.password": 0,
      },
    }
  );
  const result = await Model.aggregate(query).allowDiskUse(true);
  return { result: result[0].data, total: result[0].total, pageNum, limit };
};

const updateById = (id, payload) => {
  return Model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const changePassword = async (id, oldPassword, newPassword) => {
  // user exist check
  const user = await Model.findOne({ _id: id }).select("+password");
  if (!user) throw new Error("User not found");
  // old password compare with existing stored hash password
  const result = await bcrypt.compare(oldPassword, user?.password);
  if (!result) throw new Error("Password is invalid");
  // new password hash && update the password
  return Model.findOneAndUpdate(
    { _id: user?._id },
    { password: await bcrypt.hash(newPassword, +process.env.SALT_ROUND) },
    { new: true }
  );
};

const resetPassword = async (id, payload) => {
  // user exist check
  const user = await Model.findOne({ _id: id }).select("+password");
  if (!user) throw new Error("User not found");
  // new password hash && update the password
  return Model.findOneAndUpdate(
    { _id: user?._id },
    { password: await bcrypt.hash(payload.password, +process.env.SALT_ROUND) },
    { new: true }
  );
};

const block = async (id, payload) => {
  const user = await Model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  return Model.findOneAndUpdate({ _id: user?._id }, payload, { new: true });
};

const archive = async (id, payload) => {
  const user = await Model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  return Model.findOneAndUpdate({ _id: user?._id }, payload, { new: true });
};

module.exports = {
  archive,
  block,
  changePassword,
  create,
  getById,
  list,
  resetPassword,
  updateById,
};
