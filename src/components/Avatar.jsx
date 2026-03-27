import React from 'react';
import styles from './Avatar.module.css';

const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
};

const getColor = (id = '') => {
    const colors = ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653', '#E85D75', '#8338EC'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ name, userId }) => {
    const initials = getInitials(name);
    const backgroundColor = getColor(userId);

    return (
        <div className={styles.avatar} style={{ backgroundColor }}>
            {initials}
        </div>
    );
};

export default Avatar;