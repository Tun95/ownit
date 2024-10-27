// utils/Utils.js

import { useContext } from "react";
import { Context } from "../../context/Context";

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDecimalPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(price);
};

export const convertToNumeric = (value) => {
  const number = parseFloat(value);
  return isNaN(number) ? 0 : number.toFixed(2);
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
