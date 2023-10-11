import express from "express";
import { getAllUsers } from "./../controllers/userController";
import { signup } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.route("/").get(getAllUsers);
// router.route("/api/v1/users").get(getAllUsers).post(createUser);
// router
//   .route("/api/v1/users/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

export default router;
