import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import Card from '../components/Card';
import Button from '../components/Button';
import cardStyles from '../components/Card.module.css';

const TherapistDetailPage = () => {
    const { id } = useParams();
    const { token, user } = useAuth(); // Get the logged-in user object
    const [therapist, setTherapist] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the calendar booking modal
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileRes, servicesRes] = await Promise.all([
                fetch(`http://localhost:8080/api/therapists/${id}`),
                fetch(`http://localhost:8080/api/therapists/profile/${id}/services`)
            ]);

            if (!profileRes.ok) throw new Error('Therapist profile not found.');
            if (!servicesRes.ok) console.warn('Could not fetch services for this therapist.');

            const profileData = await profileRes.json();
            const servicesData = servicesRes.ok ? await servicesRes.json() : [];

            setTherapist(profileData);
            setServices(servicesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]); // FIX: Added 'id' to dependency array for correctness

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate || !therapist || !therapist.therapistId) return;
            setIsLoadingSlots(true);
            setAvailableSlots([]);
            setSelectedSlot(null);
            const dateStr = selectedDate.toISOString().split('T')[0];

            try {
                const response = await fetch(`http://localhost:8080/api/therapists/${therapist.therapistId}/available-slots?date=${dateStr}`);
                if (!response.ok) throw new Error('No available slots for this date.');
                const data = await response.json();
                setAvailableSlots(data);
            } catch (err) {
                console.error(err.message);
                setAvailableSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        };
        if (showModal) { fetchAvailableSlots(); }
    }, [selectedDate, therapist, showModal]);

    const handleBookClick = (service) => {
        setSelectedService(service);
        setSelectedDate(new Date());
        setSelectedSlot(null);
        setShowModal(true);
    };
    
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot) {
            toast.error("Please select an available time slot.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    therapistId: therapist.therapistId,
                    serviceId: selectedService.id,
                    appointmentTime: selectedSlot.startTime
                })
            });
            if (!response.ok) throw new Error('Failed to book appointment. The slot may have just been taken.');
            toast.success(`Appointment booked for ${new Date(selectedSlot.startTime).toLocaleString()}`);
            setShowModal(false);
        } catch (err) {
            toast.error(err.message);
        }
    };
    
    if (loading) return <LoadingSpinner text="Loading profile..." />;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;
    if (!therapist) return <p>Therapist profile could not be loaded.</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <Card>
                        <div className={cardStyles.cardContent}>
                            <h1 className="card-title">{therapist.name}, {therapist.credentials}</h1>
                            <div className="mb-3">{therapist.specializations?.map(spec => (<span key={spec} className="badge bg-primary me-1">{spec}</span>))}</div>
                            <hr/>
                            <h4 className="mt-4">About Me</h4>
                            {therapist.bio ? <ReactMarkdown>{therapist.bio}</ReactMarkdown> : <p>No biography provided.</p>}
                        </div>
                    </Card>

                    <h3 className="mt-5 mb-3">Services Offered</h3>
                    {services.length > 0 ? (
                        services.map(service => (
                            <Card className="mb-3" key={service.id}>
                                <div className={`${cardStyles.cardContent}`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="card-title mb-1">{service.name}</h5>
                                            <p className="card-text text-muted">{service.durationInMinutes} minutes</p>
                                        </div>
                                        <div className="text-end">
                                            <h4 className="mb-2">${service.price.toFixed(2)}</h4>
                                            {/* FINAL FIX: Check if the logged-in user is the same as the therapist */}
                                            {token && user?.id !== therapist.therapistId && (
                                                <Button onClick={() => handleBookClick(service)}>Book Now</Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="card-text mt-2 mb-0">{service.description}</p>
                                </div>
                            </Card>
                        ))
                    ) : (<p>This therapist has not listed any services yet.</p>)}
                    
                    <div className="mt-4"><Link to="/therapists">← Back to Directory</Link></div>

                    {showModal && (
                        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Book: {selectedService.name}</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <form onSubmit={handleBookingSubmit}>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-md-6 d-flex justify-content-center">
                                                    <div>
                                                        <h6>1. Select a Date</h6>
                                                        <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6>2. Select an Available Time</h6>
                                                    {isLoadingSlots ? <LoadingSpinner /> : (
                                                        <div className="list-group" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                                            {availableSlots.length > 0 ? availableSlots.map(slot => (
                                                                <button type="button" key={slot.startTime} className={`list-group-item list-group-item-action ${selectedSlot?.startTime === slot.startTime ? 'active' : ''}`} onClick={() => setSelectedSlot(slot)}>
                                                                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </button>
                                                            )) : <p className="p-2">No available slots on this day.</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary" disabled={!selectedSlot || isLoadingSlots}>Confirm Booking</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TherapistDetailPage;