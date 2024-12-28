"use server";

import axios from "axios";

export const fetchOrders = async (params) => {
  try {
    const { startDate, endDate } = params;

    const token = process.env.SECRET_KEY;

    const response = await axios.post(
      `https://backend.qistbazaar.pk/api/finance/store-revenue`,
      null,
      {
        params: {
          startDate,
          endDate,
          token,
        },
      }
    );

    console.log("API Response Data:", response.data);

    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
