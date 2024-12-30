// Candidates.js

import React, { useState } from 'react';
import '../styles/Candidates.css'; // Create a CSS file for styling

const candidateData = [
    {
        id: 1,
        name: 'John Doe',
        position: 'Software Engineer',
        status: 'Interviewed',
        email: 'john.doe@example.com',
    },
    {
        id: 2,
        name: 'Jane Smith',
        position: 'Product Manager',
        status: 'Applied',
        email: 'jane.smith@example.com',
    },
    {
        id: 3,
        name: 'Alice Johnson',
        position: 'UX/UI Designer',
        status: 'Interview Scheduled',
        email: 'alice.johnson@example.com',
    },
];

const Candidates = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const handleCandidateClick = (candidate) => {
        setSelectedCandidate(candidate);
    };

    const closeCandidateDetail = () => {
        setSelectedCandidate(null);
    };

    return (
        <div className="candidates-container">
            <h2>Candidates</h2>
            <div className="candidates-list">
                {candidateData.map((candidate) => (
                    <div className="candidate-card" key={candidate.id} onClick={() => handleCandidateClick(candidate)}>
                        <h3>{candidate.name}</h3>
                        <p><strong>Position:</strong> {candidate.position}</p>
                        <p><strong>Status:</strong> {candidate.status}</p>
                    </div>
                ))}
            </div>

            {selectedCandidate && (
                <div className="candidate-detail">
                    <h3>{selectedCandidate.name}</h3>
                    <p><strong>Position:</strong> {selectedCandidate.position}</p>
                    <p><strong>Status:</strong> {selectedCandidate.status}</p>
                    <p><strong>Email:</strong> {selectedCandidate.email}</p>
                    <button onClick={closeCandidateDetail}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Candidates;
