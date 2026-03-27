import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const MyAvailabilityPage = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });
    const { token } = useAuth();

    const fetchAvailability = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/availability/my-availability', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch availability.');
            const data = await response.json();
            setSlots(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    const handleFormChange = (e) => {
        setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newSlot)
            });
            if (!response.ok) throw new Error('Failed to add slot. Check for overlaps or invalid times.');
            toast.success('Availability slot added!');
            setNewSlot({ startTime: '', endTime: '' }); // Reset form
            fetchAvailability(); // Refresh list
        } catch (err) {
            toast.error(err.message);
        }
    };
    
    const handleDelete = async (slotId) => {
        if(window.confirm('Are you sure you want to delete this time slot?')) {
             try {
                const response = await fetch(`http://localhost:8080/api/availability/${slotId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete slot.');
                toast.success('Slot deleted.');
                fetchAvailability(); // Refresh list
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading your schedule..." />;

    return (
        <div className="container mt-5">
            <h1>Manage Your Availability</h1>
            <div className="row">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header"><h4>Add New Time Slot</h4></div>
                        <div className="card-body">
                            <form onSubmit={handleAddSlot}>
                                <div className="mb-3">
                                    <label>Start Time</label>
                                    <input type="datetime-local" name="startTime" className="form-control" value={newSlot.startTime} onChange={handleFormChange} required />
                                </div>
                                <div className="mb-3">
                                    <label>End Time</label>
                                    <input type="datetime-local" name="endTime" className="form-control" value={newSlot.endTime} onChange={handleFormChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Add to Schedule</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                     <div className="card">
                        <div className="card-header"><h4>Your Current Availability</h4></div>
                        <ul className="list-group list-group-flush">
                           {slots.length > 0 ? slots.map(slot => (
                               <li key={slot.id} className="list-group-item d-flex justify-content-between align-items-center">
                                   <div>
                                       <strong>{new Date(slot.startTime).toLocaleDateString()}</strong>
                                       <br />
                                       {new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}
                                   </div>
                                   <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(slot.id)}>Delete</button>
                               </li>
                           )) : <li className="list-group-item">You have not set any available times.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAvailabilityPage;