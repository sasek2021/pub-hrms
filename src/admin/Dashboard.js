// // src/components/Dashboard.js
// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import Sidebar from './Sidebar';
// import Logout from './Logout';

// const Dashboard = () => {
//     return (
//         <div style={{ display: 'flex' }}>
//             <Sidebar />
//             <Container style={{ marginLeft: '260px' }}>
//                 <Row>
//                     <Col>
//                         <h1>Welcome to the Dashboard</h1>
//                         <p>This is a protected route.</p>

//                         {/* Render the existing Logout component */}
//                         <Logout />
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default Dashboard;


import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Logout from '../components/Logout';

const Dashboard = () => {
    return (
        <Row>
            <Col>
                <h1>Welcome to the Dashboard</h1>
                <p>This is a protected route.</p>
            </Col>
        </Row>
    );
};

export default Dashboard;
