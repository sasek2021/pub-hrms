// Jobs.js

import React, { useState } from 'react';
import '../styles/Jobs.css'; // Create a CSS file for styling

const jobData = [
    {
        id: 1,
        title: 'Software Engineer',
        company: 'Tech Solutions Inc.',
        location: 'New York, NY',
        description: 'Develop and maintain web applications using React and Node.js.',
        postedDate: '2024-10-20',
    },
    {
        id: 2,
        title: 'Product Manager',
        company: 'Innovate Corp.',
        location: 'San Francisco, CA',
        description: 'Lead product development and manage the product lifecycle.',
        postedDate: '2024-10-18',
    },
    {
        id: 3,
        title: 'UX/UI Designer',
        company: 'Creative Minds LLC',
        location: 'Remote',
        description: 'Design user-friendly interfaces and improve user experience.',
        postedDate: '2024-10-15',
    },
];

const Jobs = () => {
    const [selectedJob, setSelectedJob] = useState(null);

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    const closeJobDetail = () => {
        setSelectedJob(null);
    };

    return (
        <div className="jobs-container">
            <h2>Job Openings</h2>
            <div className="jobs-list">
                {jobData.map((job) => (
                    <div className="job-card" key={job.id} onClick={() => handleJobClick(job)}>
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Posted:</strong> {job.postedDate}</p>
                    </div>
                ))}
            </div>

            {selectedJob && (
                <div className="job-detail">
                    <h3>{selectedJob.title}</h3>
                    <p><strong>Company:</strong> {selectedJob.company}</p>
                    <p><strong>Location:</strong> {selectedJob.location}</p>
                    <p><strong>Posted:</strong> {selectedJob.postedDate}</p>
                    <p><strong>Description:</strong> {selectedJob.description}</p>
                    <button onClick={closeJobDetail}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Jobs;
