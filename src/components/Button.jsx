import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
    // Combine the base button class with the variant class (e.g., styles.primary)
    const buttonClassName = `${styles.button} ${styles[variant]}`;

    return (
        <button
            type={type}
            className={buttonClassName}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;