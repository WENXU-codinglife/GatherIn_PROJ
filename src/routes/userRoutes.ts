import express from "express";
import { getAllUsers } from "./../controllers/userController";

const router = express.Router();
router.route("/").get(getAllUsers);
// router.route("/api/v1/users").get(getAllUsers).post(createUser);
// router
//   .route("/api/v1/users/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

export default router;
