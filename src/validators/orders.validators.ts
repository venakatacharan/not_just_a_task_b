import { body } from "express-validator";

export const createOrderValidation = [
    body('itemName')
        .isString().withMessage('Item name must be a string')
        .notEmpty().withMessage('Item name is required'),
    body('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
    body('total')
        .isFloat({ min: 0 }).withMessage('Total must be a float number greater than or equal to 0'),
    body('customerId')
        .isString().withMessage('Customer ID must be a string')
        .notEmpty().withMessage('Customer ID is required'),
];

export const updateOrderValidation = [
    body('itemName')
        .isString().withMessage('Item name must be a string')
        .notEmpty().withMessage('Item name is required'),
    body('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
    body('total')
        .isFloat({ min: 0 }).withMessage('Total must be a float number greater than or equal to 0'),
    body('customerId')
        .isString().withMessage('Customer ID must be a string')
        .notEmpty().withMessage('Customer ID is required')
];
