"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApproval = exports.list = void 0;
const review_service_1 = require("../services/review.service");
const request_1 = require("../utils/request");
const list = async (req, res) => {
    const reviews = await (0, review_service_1.listAllReviews)(req.query);
    res.status(200).json({ success: true, data: { reviews } });
};
exports.list = list;
const updateApproval = async (req, res) => {
    const review = await (0, review_service_1.updateReviewApproval)((0, request_1.getParam)(req.params, "id"), req.body.is_approved);
    res.status(200).json({ success: true, data: { review } });
};
exports.updateApproval = updateApproval;
