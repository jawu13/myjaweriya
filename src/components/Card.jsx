import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '' }) => {
    // We combine our custom style with any additional classes passed in
    const cardClassName = `${styles.card} ${className}`;
    
    return (
        <div className={cardClassName}>
            {children}
        </div>
    );
};

export default Card;