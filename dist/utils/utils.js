"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentMode = void 0;
const currentMode = (mode) => {
    return process.env.NODE_ENV === mode;
};
exports.currentMode = currentMode;
