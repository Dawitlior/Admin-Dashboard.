import OverallStat from "../models/overallStat.js";

export const getSales = async (request, response) => {
  try {
    const overallStats = await OverallStat.find();

    response.status(200).json(overallStats[0]);
  } catch (error) {
    response.status(401).json({ message: error.message });
  }
};
