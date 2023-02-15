import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getProducts = async (request, response) => {
  try {
    const products = await Product.find();

    const productWithStat = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );
    response.status(200).json(productWithStat);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (request, response) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    response.status(200).json(customers);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (request, response) => {
  try {
    const { page = 1, pageSize = 20, sort = null, search = "" } = request.body;
    const generalSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generalSort() : {};
    const transactions = await Transaction.find({
      $or: [{ cost: { $regex: new RegExp(search, "i") } }],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $option: "i" },
    });

    response.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};
