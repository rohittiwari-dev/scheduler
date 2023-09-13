import ics from 'ics'

const generateICS = (event, meetLink, host_email, host_name, savedEventData) => {
    const fromDatetimeString = event.start.dateTime;
    const toDatetimeString = event.end.dateTime;

// Parse datetime strings into Date objects
    const fromDate = new Date(fromDatetimeString);
    const toDate = new Date(toDatetimeString);

// Event details
    const eventICS = {
        uid: savedEventData.uid,
        productId: savedEventData.productId,
        start: [fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate(), fromDate.getHours(), fromDate.getMinutes()],
        end: [toDate.getFullYear(), toDate.getMonth() + 1, toDate.getDate(), toDate.getHours(), toDate.getMinutes()],
        title: `${event.summary}`,
        location: `${event.location}`,
        description: `${event.description} \nHost: ${host_name}, Email: ${host_name}`,
        url: meetLink, // Add your Google Meet link here
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        method: "REQUEST",
        organizer: {name: host_name, email: host_email},
        attendees: event.attendees.map((attendee) => ({email: attendee.email, rsvp: true})),
        alarms: [
            {action: 'email', trigger: {minutes: 24 * 60}},
            {action: 'display', trigger: {minutes: 60}},
            {action: 'display', trigger: {minutes: 10}},
        ],
    };

    const {error, value} = ics.createEvent(eventICS);
    if (error) {
        console.error('Error creating ICS event:', error);
        throw error;
    }
    return value;
}
export default generateICS