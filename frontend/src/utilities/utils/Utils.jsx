// utils/Utils.js

import { useContext } from "react";
import { Context } from "../../context/Context";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import PropTypes from "prop-types";

// ERROR HANDLER
export const getError = (error) => {
  return error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// FORMAT NUMBER WITH DECIMALS
export const formatNumberShort = (value) => {
  const suffixes = ["", "k", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  // Format number with one decimal place
  const formattedValue = value.toFixed(1);

  // Remove trailing .0 if there is no decimal value
  const result = formattedValue.endsWith(".0")
    ? formattedValue.slice(0, -2)
    : formattedValue;

  return `${result}${suffixes[suffixIndex]}`;
};

// FORMAT NUMBER With no Decimal
export const formatNumberNoDecimalShort = (value) => {
  const suffixes = ["", "k", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  // Use Math.floor to remove decimal places
  return `${Math.floor(value)}${suffixes[suffixIndex]}`;
};

// FORMAT NUMBER WITH 2 DECIMAL PLACES WITHOUT SUFFIXES
export const formatNumberWithTwoDecimalsNoSuffix = (value) => {
  // Ensure the value is a number
  const numericValue = parseFloat(value);

  // Check if the value is not a valid number
  if (isNaN(numericValue)) {
    return "0"; // or handle the case as needed
  }

  // Format number with two decimal places
  const formattedValue = numericValue.toFixed(2);

  // Remove trailing .00 if there are no decimal values
  return formattedValue.endsWith(".00")
    ? formattedValue.slice(0, -3)
    : formattedValue;
};

// FORMAT DATE FUNCTIONS

/**
 * Converts a date string to a Date object.
 * @param dateStr - The date string to convert
 * @returns The Date object
 */
const parseDate = (dateStr) => {
  return new Date(dateStr);
};

/**
 * Formats a date string as "DD/MM/YYYY"
 * @param dateStr - The date string to format
 * @returns The formatted date string
 */
export const formatDateSlash = (dateStr) => {
  const date = parseDate(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formats a date string as "DD Month YYYY"
 * @param dateStr - The date string to format
 * @returns The formatted date string
 */
export const formatDateLong = (dateStr) => {
  const date = parseDate(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Formats a date string as "DDth of Month YYYY"
 * @param dateStr - The date string to format
 * @returns The formatted date string
 */
export const formatDateOrdinal = (dateStr) => {
  const date = parseDate(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Function to get ordinal suffix for a day
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

/**
 * Formats a date to "X time ago" relative to now.
 * @param date - The ISO 8601 date string to format.
 * @returns A string representing the time difference.
 */
export function formatDateAgo(date) {
  if (!date) {
    return "...";
  }

  // Parse the ISO date string into a Date object
  const parsedDate = parseISO(date);

  // Check if the parsed date is valid
  if (!isValid(parsedDate)) {
    return "...";
  }

  // Format the date as "X time ago"
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

// PropTypes for utility functions (if needed)
getError.propTypes = {
  error: PropTypes.shape({
    response: PropTypes.shape({
      data: PropTypes.shape({
        message: PropTypes.string,
      }),
    }),
    message: PropTypes.string.isRequired,
  }).isRequired,
};
