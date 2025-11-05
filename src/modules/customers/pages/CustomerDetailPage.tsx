import React from 'react';
import { useParams } from 'react-router-dom';

const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Customer Detail Page</h1>
            <p>Details for customer with ID: {id}</p>
        </div>
    );
};

export default CustomerDetailPage;