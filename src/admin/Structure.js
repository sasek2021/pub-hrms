// Structure.js

import React from 'react';
import '../styles/Structure.css'; // Create a CSS file for styling

const structureData = [
    {
        id: 1,
        name: 'Engineering',
        teams: [
            { id: 1, name: 'Frontend Team' },
            { id: 2, name: 'Backend Team' },
            { id: 3, name: 'DevOps Team' },
        ],
    },
    {
        id: 2,
        name: 'Product',
        teams: [
            { id: 4, name: 'Product Management' },
            { id: 5, name: 'User Research' },
        ],
    },
    {
        id: 3,
        name: 'Design',
        teams: [
            { id: 6, name: 'UX Team' },
            { id: 7, name: 'UI Team' },
        ],
    },
];

const Structure = () => {
    return (
        <div className="structure-container">
            <h2>Company Structure</h2>
            <div className="structure-list">
                {structureData.map((department) => (
                    <div className="department" key={department.id}>
                        <h3>{department.name}</h3>
                        <ul className="team-list">
                            {department.teams.map((team) => (
                                <li key={team.id} className="team">
                                    {team.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Structure;
