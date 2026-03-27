import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const NavigationToastHandler = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if the page was navigated to with a message in the state
        if (location.state?.message) {
            toast.success(location.state.message);
            // Clear the message from the state so it doesn't reappear on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // This component doesn't render anything, it just handles the effect
    return null; 
};

export default NavigationToastHandler;