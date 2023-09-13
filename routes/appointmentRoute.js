// Package Import
import {Router} from "express";
// Local Import
import CatchAsyncError from "../utils/CatchAsyncError.js";
import {
    handleCreateAppointment,
    handleDeleteAppointment,
    handleGetAppointment,
    handleListAllAppointment,
    handleListAppointmentByConsultantEmail,
    handleListAppointmentByConsultantLogin
} from "../controllers/appointmentController.js";

const appointmentRoute = Router();

appointmentRoute.get("/list", CatchAsyncError(handleListAllAppointment));
appointmentRoute.get("/list/login", CatchAsyncError(handleListAppointmentByConsultantLogin));
appointmentRoute.get("/list/:consultant_email", CatchAsyncError(handleListAppointmentByConsultantEmail));
appointmentRoute.delete("/:appointment_id", CatchAsyncError(handleDeleteAppointment));
appointmentRoute.get("/:appointment_id", CatchAsyncError(handleGetAppointment));
appointmentRoute.post("/", CatchAsyncError(handleCreateAppointment));

export default appointmentRoute;
