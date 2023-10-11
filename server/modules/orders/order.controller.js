const { v4: uuidv4 } = require("uuid");
const Model = require("./order.model");
const productModel = require("../products/product.model");

const create = (payload) => {
  // Create unique ID
  payload.id = uuidv4();
  // Decrease the product stock
  const products = payload?.products;
  products.map(async (product) => {
    const { product: id, quantity } = product;
    // find the product
    const productInfo = await productModel.findOne({ _id: id });
    if (!productInfo) throw new Error("Product not found");
    // Update the stock
    const newQuantity = productInfo?.quantity - quantity;
    if (newQuantity < 0) {
      throw new Error(`${productInfo?.name} Stock is depleted`);
    }
    // Write the new Quantity to product stock
    await productModel.findOneAndUpdate(
      { _id: id },
      { quantity: newQuantity },
      { new: true }
    );
  });
  // Create the order
  return Model.create(payload);
};

const list = async (limit, page, search) => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 5;
  const query = [];
  if (search?.id) {
    query.push({
      $match: { id: new RegExp(search?.id, "gi") },
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
    }
  );
  const result = await Model.aggregate(query).allowDiskUse(true);
  return {
    result: result[0].data,
    total: result[0].total || 0,
    page: pageNum,
    limit,
  };
};

const getById = (id) => {
  return Model.findOne({ id });
};

const updateById = (id, payload) => {
  const { products, ...rest } = payload;
  return Model.findOneAndUpdate({ id }, rest, { new: true });
};

const deleteById = async (id, payload) => {
  const order = await Model.findOne({ id });
  // Increase the product stock
  const products = order?.products;
  products.map(async (product) => {
    const { product: id, quantity } = product;
    // find the product
    const productInfo = await productModel.findOne({ _id: id });
    if (!productInfo) throw new Error("Product not found");
    // Update the stock
    const newQuantity = productInfo?.quantity + quantity;
    // Write the new Quantity to product stock
    await productModel.findOneAndUpdate(
      { _id: id },
      {
        quantity: newQuantity,
        updated_by: payload?.updated_by,
        updated_at: payload?.updated_at,
      },
      { new: true }
    );
  });
  // Create the order
  return Model.deleteOne({ id });
};

const approve = (id, payload) => {
  return Model.findOneAndUpdate(
    { id },
    {
      status: payload?.status,
      updated_by: payload?.updated_by,
      updated_at: payload?.updated_at,
    },
    { new: true }
  );
};

module.exports = { approve, create, deleteById, getById, list, updateById };
