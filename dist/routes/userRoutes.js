"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./../controllers/userController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/signup", authController_1.signup);
router.route("/").get(userController_1.getAllUsers);
// router.route("/api/v1/users").get(getAllUsers).post(createUser);
// router
//   .route("/api/v1/users/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);
exports.default = router;
