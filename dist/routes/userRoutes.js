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
router.get("/login", authController_1.login);
router.post("/forgotPassword", authController_1.forgotPassword);
// router.patch('/resetPassword/:token', );
router.route("/").get(authController_1.protect, userController_1.getAllUsers);
// router.route("/api/v1/users").get(getAllUsers).post(createUser);
router
    .route("/:id")
    //   .get(getUser)
    //   .patch(updateUser)
    .delete(authController_1.protect, (0, authController_1.restrictTo)("admin", "creator"), userController_1.deleteUser);
exports.default = router;
