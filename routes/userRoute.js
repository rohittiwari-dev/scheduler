// Package Imports
import {Router} from "express";
// Local Import
import CatchAsyncError from "../utils/CatchAsyncError.js";
import {
    handleDeleteUserById,
    handleGetUserByEmail,
    handleGetUserById,
    handleListUser,
} from "../controllers/userController.js";

// ROUTE CREATION
const consultantsRoutes = Router();

/* Route Declarations */
consultantsRoutes.get("/list", CatchAsyncError(handleListUser));
consultantsRoutes.get("/:id", CatchAsyncError(handleGetUserById));
consultantsRoutes.get("/email/:email", CatchAsyncError(handleGetUserByEmail));
consultantsRoutes.delete("/:id", CatchAsyncError(handleDeleteUserById));

export default consultantsRoutes;
