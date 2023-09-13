import db from "../db/DBConnect.js";
import {google} from "googleapis";
import ApiResponse from "../messages/ApiResponse.js";
import convertToDateISOString from "../utils/convertToDateISOString.js";
import generateUniqueConferenceId from "../utils/generateUniqueConferenceId.js";
import {BadRequest, EmptyRequiredData, NotFoundError, NotImplemented, Restricted} from "../errors/CustomError.js";

export const handleCreateAppointment = async (req, res) => {
    const {
        service_id,
        consultant_email,
        from_date,
        to_date,
        from_time,
        to_time,
        from_weekday,
        to_weekday,
        client_name,
        client_email,
        guest_emails
    } = req.body

    if (!service_id || !from_date || !to_date || !from_time || !client_email || !client_name || !to_time)
        throw new EmptyRequiredData("Please Provide all the required data [service_id , from_date , to_date ,from_time ,client_email,client_name,to_time]")

    const [serviceRows, serviceFields] = await db.promisePool.query(`SELECT *  FROM SERVICE_TABLE CROSS JOIN USER_TABLE WHERE SERVICE_TABLE.ID=${service_id} AND USER_TABLE.EMAIL=SERVICE_TABLE.HOST_EMAIL`);

    const eventAndUserInfo = serviceRows[0]
    if (!eventAndUserInfo) throw new NotFoundError("Not Event and Linked Host Found With this ID")

    const newFromDate = convertToDateISOString(from_date);
    const newToDate = convertToDateISOString(to_date)

    const fromDatetimeString = `${newFromDate}T${from_time}`;
    const toDatetimeString = `${newToDate}T${to_time}`;

    if (new Date(fromDatetimeString) >= new Date(toDatetimeString)) {
        throw new BadRequest("Start time must be earlier than end time");
    }

    const event = {
        summary: `${eventAndUserInfo.SERVICE_NAME} | ${eventAndUserInfo.SERVICE_TYPE}`,
        location: `${eventAndUserInfo.SERVICE_LOCATION}`,
        description: 'This is the Event Created using Scheduler Platform is all about you booked the service from Scheduler APP | Rohit Tiwari' + `${eventAndUserInfo.SERVICE_NAME} | ${eventAndUserInfo.SERVICE_TYPE}`,
        start: {
            dateTime: `${fromDatetimeString}`,
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: `${toDatetimeString}`,
            timeZone: 'Asia/Kolkata',
        },

        attendees: [...guest_emails || [], client_email].map(email => new Object({
            email: email
        })),
        reminders: {
            useDefault: false,
            overrides: [
                {method: 'email', minutes: 24 * 60},
                {method: 'popup', minutes: 60},
                {method: 'popup', minutes: 10},
            ],
        },
    };
    const locationValidation = eventAndUserInfo.SERVICE_LOCATION.toLowerCase();
    if (locationValidation.includes('google meet') || locationValidation.includes('googlemeet') || locationValidation.includes('google-meet')) {
        event.conferenceData = {
            createRequest: {
                requestId: generateUniqueConferenceId(),
                conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                },
                role: 'organizer',
                entryPoints: [
                    {
                        entryPointType: 'video',
                        accessLevel: 'private',
                    },
                ],
            },
        };
    }

    const {OAuth2} = google.auth;

    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.BASE_URL + "/api/v1/auth/google/callback"
    );

    oauth2Client.setCredentials({
        access_token: eventAndUserInfo.ACCESS_TOKEN,
        refresh_token: eventAndUserInfo.REFRESH_TOKEN,
    });
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    const {data} = await calendar.events.insert(
        {
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            sendNotifications: true,
        }
    )
    if (!data) new BadRequest("Something Went Wrong in Scheduling Event, Please Try After Sometime..")
    const appointmentInsertQuery = `INSERT INTO APPOINTMENT_TABLE(CLIENT_NAME, CLIENT_EMAIL, GUEST_EMAILS, MEETING_LINK, FROM_DATE, TO_DATE, FROM_TIME, TO_TIME, FROM_WEEKDAY, TO_WEEKDAY, EVENT_ID, CONSULTANT_EMAIL) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`

    // ADD DATA TO APPOINTMENT TABLE
    const [rows, fields] = await db.promisePool.query(appointmentInsertQuery, [client_name, client_email, JSON.stringify(guest_emails) || null, data.hangoutLink, newFromDate, newToDate, from_time, to_time, from_weekday, to_weekday, service_id, eventAndUserInfo.EMAIL])

    // This Can you used if Custom Email is Required to be sent on event Creation
    // sendAppointmentConfirmationEmail(event, client_email, client_name, data, eventAndUserInfo.EMAIL, eventAndUserInfo.NAME, eventAndUserInfo.ACCESS_TOKEN, eventAndUserInfo.REFRESH_TOKEN).then(res => console.log("message Sent Successfully...")).catch(rrr => {
    //     throw rrr
    // })
    if (rows.insertId <= 0)
        throw new NotImplemented("Appointment Created and Scheduled, failed to save to database,")

    new ApiResponse(res, 201, "Appointment Scheduled and Event created in Calendar..", rows.insertId)
}

export const handleListAppointmentByConsultantEmail = async (req, res) => {
    const {consultant_email} = req.params;
    const {page = 1, itemsPerPage = 10} = req.query; // Default page and itemsPerPage values

    if (!consultant_email) throw new EmptyRequiredData("Consultant Email id is Required...");

    // Calculate the OFFSET based on the page number and items per page
    const offset = (page - 1) * itemsPerPage;

    const query = `SELECT * FROM APPOINTMENT_TABLE WHERE CONSULTANT_EMAIL=? LIMIT ? OFFSET ?`;

    const [rows, fields] = await db.promisePool.query(query, [consultant_email, Number(itemsPerPage), Number(offset)]);

    if (rows.length <= 0) {
        new ApiResponse(res, 200, "No Appointment Found with this Consultant Email..", rows);
    } else {
        new ApiResponse(res, 200, "Appointment List Fetched With Consultant Email...", rows);
    }
}

export const handleListAppointmentByConsultantLogin = async (req, res) => {
    const user = req.user.profile._json;
    const {page = 1, itemsPerPage = 10} = req.query; // Default page and itemsPerPage values

    if (!user) throw new Restricted("The User is not Logged in ...");

    // Calculate the OFFSET based on the page number and items per page
    const offset = (page - 1) * itemsPerPage;

    const query = `SELECT * FROM APPOINTMENT_TABLE WHERE CONSULTANT_EMAIL=? LIMIT ? OFFSET ?`;

    const [rows, fields] = await db.promisePool.query(query, [user.email, Number(itemsPerPage), Number(offset)]);

    if (rows.length <= 0) {
        new ApiResponse(res, 200, "No Appointment Found with this Consultant Email..", rows);
    } else {
        new ApiResponse(res, 200, "Appointment List Fetched With Consultant Email...", rows);
    }
}

export const handleListAllAppointment = async (req, res) => {
    const {page = 1, itemsPerPage = 10} = req.query; // Default page and itemsPerPage values

    // Calculate the OFFSET based on the page number and items per page
    const offset = (page - 1) * itemsPerPage;

    const query = `SELECT * FROM APPOINTMENT_TABLE LIMIT ? OFFSET ?`;

    const [rows, fields] = await db.promisePool.query(query, [Number(itemsPerPage), Number(offset)]);

    if (rows.length <= 0) {
        new ApiResponse(res, 200, "No Appointments Found...", rows);
    } else {
        new ApiResponse(res, 200, "Appointment List Fetched...", rows);
    }
}

export const handleDeleteAppointment = async (req, res) => {
    const {appointment_id} = req.params;

    // Check if consultant_email and appointment_id are provided
    if (!appointment_id) {
        throw new EmptyRequiredData('Appointment ID is required.');
    }

    // Create and execute a SQL query to delete the appointment
    const deleteQuery = 'DELETE FROM APPOINTMENT_TABLE WHERE ID=?';
    const [result] = await db.promisePool.query(deleteQuery, [appointment_id]);

    // Check if the appointment was deleted successfully
    if (result.affectedRows === 0) {
        throw new NotFoundError('Appointment not found.');
    }

    // Send a success response
    new ApiResponse(res, 200, 'Appointment deleted successfully.');
};

export const handleGetAppointment = async (req, res) => {
    const {appointment_id} = req.params;

    // Check if consultant_email and appointment_id are provided
    if (!appointment_id) {
        throw new EmptyRequiredData('Appointment ID is required.');
    }

    // Create and execute a SQL query to delete the appointment
    const fetchQuery = 'SELECT * FROM APPOINTMENT_TABLE WHERE ID=?';
    const [result] = await db.promisePool.query(fetchQuery, [appointment_id]);

    // Check if the appointment was deleted successfully
    if (!result[0]) {
        throw new NotFoundError('Appointment not found.');
    }

    // Send a success response
    new ApiResponse(res, 200, 'Appointment Fetch successfully.', result[0]);
};