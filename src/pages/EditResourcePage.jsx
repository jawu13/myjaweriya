import React from 'react';
import ResourceForm from '../components/ResourceForm';

const EditResourcePage = () => {
    return (
        <div>
            <h1>Edit Resource</h1>
            <div className="card">
                <div className="card-body">
                    <ResourceForm isEditMode={true} />
                </div>
            </div>
        </div>
    );
};

export default EditResourcePage;