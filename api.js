// API URL - Change this to your Django backend URL
const API_URL = 'https://growth-lab-api-backend.onrender.com';

// Fetch all courses
async function fetchCourses() {
    try {
        const response = await fetch(`${API_URL}/main/courses/`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

// Fetch a single course by ID
async function fetchCourseById(id) {
    try {
        const response = await fetch(`${API_URL}/main/courses/${id}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch course');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching course ${id}:`, error);
        throw error;
    }
}

// Fetch courses for the logged-in instructor
async function fetchInstructorCourses() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${API_URL}/main/instructor/courses/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch instructor courses');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching instructor courses:', error);
        return [];
    }
}

// Create a new course
async function createCourse(courseData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${API_URL}/main/courses/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(courseData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create course');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

// Update an existing course
async function updateCourse(courseId, courseData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${API_URL}/main/courses/${courseId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(courseData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update course');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

// Delete a course
async function deleteCourseById(courseId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${API_URL}/main/courses/${courseId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete course');
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}

// Fetch all reviews
async function fetchReviews() {
    try {
        const response = await fetch(`${API_URL}/main/reviews/`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}