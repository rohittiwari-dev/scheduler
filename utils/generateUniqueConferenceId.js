function generateUniqueConferenceId() {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const randomId = Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
    return `${timestamp}-${randomId}`;
}

export default generateUniqueConferenceId