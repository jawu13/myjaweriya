import React from 'react';

const Pagination = ({ pageData, onPageChange }) => {
    // pageData can be null initially, so we provide default values
    const { number = 0, totalPages = 1, first = true, last = true } = pageData || {};

    const handlePrevious = () => {
        if (!first) {
            onPageChange(number - 1);
        }
    };

    const handleNext = () => {
        if (!last) {
            onPageChange(number + 1);
        }
    };

    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <nav className="d-flex justify-content-between align-items-center mt-4">
            <button className="btn btn-outline-secondary" onClick={handlePrevious} disabled={first}>
                &larr; Previous
            </button>
            <span>
                Page <strong>{number + 1}</strong> of <strong>{totalPages}</strong>
            </span>
            <button className="btn btn-outline-secondary" onClick={handleNext} disabled={last}>
                Next &rarr;
            </button>
        </nav>
    );
};

export default Pagination;