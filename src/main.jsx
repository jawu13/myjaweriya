import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // ADD THIS LINE
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import NavigationToastHandler from './components/NavigationToastHandler'; // Import our new handler 

// --- LAYOUTS & PROTECTORS ---
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import TherapistRoute from './components/TherapistRoute';

// --- PAGE COMPONENTS (ensure all are imported) ---
import Home from './pages/Home'; // Corrected from './pages/HomePage' 
import Register from './components/Register';
import Login from './components/Login';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import ForumPage from './pages/ForumPage';
import PostDetailPage from './pages/PostDetailPage';
import TherapistsPage from './pages/TherapistsPage';
import TherapistDetailPage from './pages/TherapistDetailPage';
import AssessmentsPage from './pages/AssessmentsPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultPage from './pages/ResultPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import TherapistApplicationPage from './pages/TherapistApplicationPage';
import MyResourcesPage from './pages/MyResourcesPage';
import TherapistServicesPage from './pages/TherapistServicesPage';
import CreateServicePage from './pages/CreateServicePage';
import EditServicePage from './pages/EditServicePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import CreateResourcePage from './pages/CreateResourcePage';
import EditResourcePage from './pages/EditResourcePage';
import AdminForumPage from './pages/AdminForumPage';
import EditPostPage from './pages/EditPostPage';
import AdminAssessmentsPage from './pages/AdminAssessmentsPage';
import CreateAssessmentPage from './pages/CreateAssessmentPage';
import EditAssessmentPage from './pages/EditAssessmentPage';
import AdminTherapistsPage from './pages/AdminTherapistsPage';
import MyAvailabilityPage from './pages/MyAvailabilityPage'; // Import the new page
import 'react-calendar/dist/Calendar.css'; // ADD THIS LINE

// --- STYLES ---
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './App.css';
import './theme.css'; // ADD THIS LINE


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* These components are now global and will work on every page */}
        <NavigationToastHandler />
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<LayoutRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);

// Helper component for all PUBLIC, USER, and THERAPIST routes
function LayoutRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="resource/:id" element={<ResourceDetailPage />} />
        <Route path="forum" element={<ForumPage />} />
        <Route path="forum/post/:id" element={<PostDetailPage />} />
        <Route path="therapists" element={<TherapistsPage />} />
        <Route path="therapist/:id" element={<TherapistDetailPage />} />

        {/* All Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="assessment/:id" element={<QuestionnairePage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="forum/create-post" element={<CreatePostPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="apply-therapist" element={<TherapistApplicationPage />} />
          
          {/* Therapist-Only Routes (Nested inside Authenticated Routes) */}
          <Route element={<TherapistRoute />}>
            <Route path="therapist/my-services" element={<TherapistServicesPage />} />
            <Route path="therapist/services/new" element={<CreateServicePage />} />
            <Route path="therapist/services/edit/:id" element={<EditServicePage />} />
            <Route path="therapist/my-resources" element={<MyResourcesPage />} />
            <Route path="therapist/resources/new" element={<CreateResourcePage />} />
            <Route path="therapist/my-availability" element={<MyAvailabilityPage />} /> {/* ADD THIS */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

// Helper component for all ADMIN routes
function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="resources/new" element={<CreateResourcePage />} />
          <Route path="resources/edit/:id" element={<EditResourcePage />} />
          <Route path="forum" element={<AdminForumPage />} />
          <Route path="forum/edit/:id" element={<EditPostPage />} />
          <Route path="assessments" element={<AdminAssessmentsPage />} />
          <Route path="assessments/new" element={<CreateAssessmentPage />} />
          <Route path="assessments/edit/:id" element={<EditAssessmentPage />} />
          <Route path="therapists" element={<AdminTherapistsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}