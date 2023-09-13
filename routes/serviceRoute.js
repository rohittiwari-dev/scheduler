// Package Import
import {Router} from "express";
// Local Imports
import CatchAsyncError from "../utils/CatchAsyncError.js";
import {
    handleCreateService,
    handleDeleteServiceByServiceId,
    handleGetServiceWithServiceId,
    handleListService,
    handleListServiceByEmail,
    handleListServiceByLoginUser
} from "../controllers/serviceController.js";

// Router
const serviceRoute = Router();

// Get
serviceRoute.get("/list", CatchAsyncError(handleListService));
serviceRoute.get("/list/user", CatchAsyncError(handleListServiceByLoginUser))
serviceRoute.get("/list/:email", CatchAsyncError(handleListServiceByEmail))
serviceRoute.get("/:serviceId", CatchAsyncError(handleGetServiceWithServiceId));
serviceRoute.post("/", CatchAsyncError(handleCreateService));
serviceRoute.delete("/:service_id", CatchAsyncError(handleDeleteServiceByServiceId));

export default serviceRoute;
