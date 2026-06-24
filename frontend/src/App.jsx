import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import DashboardRouter from './pages/DashboardRouter';
import StoreList from './pages/user/StoreList';
import ChangePassword from './pages/user/ChangePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import StoreManagement from './pages/admin/StoreManagement';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/owner/login" element={<OwnerLoginPage />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardRouter />
                    </ProtectedRoute>
                } />

                <Route path="/stores" element={
                    <ProtectedRoute roles={['user']}>
                        <StoreList />
                    </ProtectedRoute>
                } />
                <Route path="/user/change-password" element={
                    <ProtectedRoute roles={['user']}>
                        <ChangePassword />
                    </ProtectedRoute>
                } />

                <Route path="/admin" element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute roles={['admin']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/stores" element={
                    <ProtectedRoute roles={['admin']}>
                        <StoreManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/change-password" element={
                    <ProtectedRoute roles={['admin']}>
                        <ChangePassword />
                    </ProtectedRoute>
                } />

                <Route path="/owner" element={
                    <ProtectedRoute roles={['store_owner']}>
                        <OwnerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/owner/change-password" element={
                    <ProtectedRoute roles={['store_owner']}>
                        <ChangePassword />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
