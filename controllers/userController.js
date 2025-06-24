const userModel = require('../models/userModel');

const getParticipantCourses = async (req, res) => {
    const SessionID = req.cookies.token;

    try {
        const courses = await userModel.getParticipantCourses(SessionID);
        res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching participant courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getParticipantCourseDetails = async (req, res) => {
    const CourseID = req.params.courseID;
    if (!CourseID) {
        return res.status(400).json({ error: 'CourseID is required' });
    }

    try {
        const courseDetails = await userModel.getCourseDetail(CourseID);
        res.status(200).json(courseDetails);
    } catch (err) {
        console.error('Error fetching participant course details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    getParticipantCourses,
    getParticipantCourseDetails
}