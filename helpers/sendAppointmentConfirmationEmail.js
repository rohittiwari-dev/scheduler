import nodemailer from 'nodemailer'
import generateICS from "./generateICS.js";

async function sendAppointmentConfirmationEmail(event, clientEmail, clientName, savedEventData, host_email, host_name) {

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const icsData = generateICS(event, savedEventData.hangoutLink, host_email, host_name, savedEventData);

    const mailOptions = {
        from: `"${clientName}" <${clientEmail}>`,
        to: [...event.attendees].map(attendee => attendee.email).join(', '), // Include attendees and client_email
        subject: `Confirmation for ${event.summary}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Event Invitation</title>
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Event Invitation</h2>
                <p>You are invited to the following event:</p>
                <p style="font-weight: bold;">Event Summary: ${event.summary}</p>
                <p>Date: ${event.start.dateTime.split('T')[0]}</p>
                <p>Time: ${event.start.dateTime.split('T')[1]}</p>
                <p>Location: ${event.location}</p>
                <p>Status: ${savedEventData.status}</p>
                <p>Meeting Link: ${savedEventData.hangoutLink}</p>
                <p><a href='${savedEventData.htmlLink}' style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open In Calendar</a></p>
                <!-- Add the ICS data content as a link with a data URL -->
                <p><a href='${savedEventData.hangoutLink}' style="background-color: #0d9e50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;"> <img src="${savedEventData.conferenceData.conferenceSolution.iconUri}"  alt="Google Meet" width="18" height="18"/>Join ${savedEventData.conferenceData.conferenceSolution.name}</a></p>
            </body>
            </html>
        `,
        text: 'Please find the event details attached as an ICS file.',
        attachments: [
            {
                filename: 'event.ics',
                content: icsData,
                contentType: 'text/calendar',
            },
        ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

export default sendAppointmentConfirmationEmail

