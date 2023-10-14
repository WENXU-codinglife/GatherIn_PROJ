import express from "express";
import { getAllUsers, deleteUser } from "./../controllers/userController";
import {
  login,
  protect,
  signup,
  restrictTo,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.get("/login", login);
router.route("/").get(protect, getAllUsers);
// router.route("/api/v1/users").get(getAllUsers).post(createUser);
router
  .route("/:id")
  //   .get(getUser)
  //   .patch(updateUser)
  .delete(protect, restrictTo("admin", "creator"), deleteUser);

export default router;
