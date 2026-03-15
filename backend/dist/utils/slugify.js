"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = void 0;
// Lightweight slugify helper for tags and products
const slugify = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
};
exports.slugify = slugify;
