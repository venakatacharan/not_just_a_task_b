import { body } from "express-validator";

export const createCustomerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("lastVisit").optional().isISO8601()
];

export const updateCustomerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("lastVisit").isISO8601().optional()
];
