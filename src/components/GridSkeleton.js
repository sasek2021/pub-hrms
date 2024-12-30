import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton'; // Ensure you install this package for skeleton loading
import 'react-loading-skeleton/dist/skeleton.css'; // Import the skeleton styles

const GridSkeleton = ({ count = 2, col = 4 }) => {
    return (
        <>
            <Row className='g-2 mb-3'>
                {Array.from({ length: count }).map((_, idx) => (
                    <Col key={idx} md={col}>
                        <Skeleton height={40} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default GridSkeleton;