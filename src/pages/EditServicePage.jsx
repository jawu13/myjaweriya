import React from 'react';
import ServiceForm from '../components/ServiceForm';
import PageHeader from '../components/PageHeader';

const EditServicePage = () => {
    return (
        <div className="container mt-5">
            <PageHeader
                title="Edit Service"
                subtitle="Update the details for your service offering."
            />
            <ServiceForm isEditMode={true} />
        </div>
    );
};
export default EditServicePage;