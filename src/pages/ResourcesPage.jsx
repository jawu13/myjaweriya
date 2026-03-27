import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card'; // Import our new Card component
import cardStyles from '../components/Card.module.css';

const ResourcesPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/resources?page=${currentPage}&size=9&sort=createdAt,desc`);
            if (!response.ok) throw new Error('Failed to fetch resources.');
            const data = await response.json();
            setPageData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    if (loading) return <LoadingSpinner text="Loading resources..." />;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1>Educational Resources</h1>
                <p className="lead" style={{color: 'var(--color-text-secondary)'}}>Explore articles and guides to support your mental wellness journey.</p>
            </div>
            <div className="row">
                {pageData && pageData.content.length > 0 ? (
                    pageData.content.map((resource) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={resource.id}>
                            {/* USE THE NEW CARD COMPONENT */}
                            <Card className="h-100 d-flex flex-column">
                                {/* USE THE NEW cardContent STYLE */}
                                <div className={`${cardStyles.cardContent} d-flex flex-column flex-grow-1`}>
                                    <h5 className="card-title">{resource.title}</h5>
                                    <p className="card-text"><small style={{color: 'var(--color-text-secondary)'}}>{resource.category} | By {resource.author}</small></p>
                                    <p className="card-text flex-grow-1">{resource.description || ''}</p>
                                    <Link to={`/resource/${resource.id}`} className="btn btn-outline-primary mt-auto" style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
                                        Read More
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : <p className="text-center">No resources found.</p>}
            </div>
            <Pagination pageData={pageData} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ResourcesPage;