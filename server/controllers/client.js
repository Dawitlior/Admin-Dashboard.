import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";

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
