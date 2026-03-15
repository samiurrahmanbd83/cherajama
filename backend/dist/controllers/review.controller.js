"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.list = void 0;
const review_service_1 = require("../services/review.service");
const request_1 = require("../utils/request");
// List reviews for a product (public)
const list = async (req, res) => {
    const reviews = await (0, review_service_1.listReviewsByProduct)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: { reviews } });
};
exports.list = list;
// Create review (authenticated)
const create = async (req, res) => {
    const userId = req.user.id;
    const review = await (0, review_service_1.createReview)(userId, (0, request_1.getParam)(req.params, "id"), req.body);
    res.status(201).json({ success: true, data: { review } });
};
exports.create = create;
