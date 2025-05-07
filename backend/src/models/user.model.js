"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.default.Schema({
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatarUrl: { type: String },
    refreshToken: { type: String },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model('User', UserSchema);
