import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import UserProfileDashboard from './pages/user-profile-dashboard';
import TeslaMarketplaceHome from './pages/tesla-marketplace-home';
import TeslaOfferDetails from './pages/tesla-offer-details';
import AuthenticationPortal from './pages/authentication-portal';
import CreateTeslaListing from './pages/create-tesla-listing';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<TeslaMarketplaceHome />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-profile-dashboard" element={<UserProfileDashboard />} />
        <Route path="/tesla-marketplace-home" element={<TeslaMarketplaceHome />} />
        <Route path="/tesla-offer-details" element={<TeslaOfferDetails />} />
        <Route path="/authentication-portal" element={<AuthenticationPortal />} />
        <Route path="/create-tesla-listing" element={<CreateTeslaListing />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
