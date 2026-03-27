import React from 'react';
import ResourceForm from '../components/ResourceForm';

const CreateResourcePage = () => {
    return (
        <div>
            <h1>Create New Resource</h1>
            <div className="card">
                <div className="card-body">
                    <ResourceForm />
                </div>
            </div>
        </div>
    );
};

export default CreateResourcePage;