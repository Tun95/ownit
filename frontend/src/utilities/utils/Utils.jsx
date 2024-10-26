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

// Custom hooks to use context
export const useAppState = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAppState must be used within a ContextProvider");
  }
  return context.state;
};

export const useAppDispatch = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a ContextProvider");
  }
  return context.dispatch;
};

export const useSearch = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSearch must be used within a ContextProvider");
  }
  return {
    query: context.state.query,
    setQuery: (query) =>
      context.dispatch({ type: "SET_QUERY", payload: query }),
    clearQuery: () => context.dispatch({ type: "CLEAR_QUERY" }),
  };
};
