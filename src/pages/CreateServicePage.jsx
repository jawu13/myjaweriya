// This is a simple wrapper page for the form component
import React from 'react';
import ServiceForm from '../components/ServiceForm';

const CreateServicePage = () => {
    return (
        <div className="container mt-5">
            <h1>Create a New Service</h1>
            <ServiceForm />
        </div>
    );
};

export default CreateServicePage;