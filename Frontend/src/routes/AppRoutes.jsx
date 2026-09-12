import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import StaffDashboardPage from "../features/dashboard/pages/StaffDashboardPage";
import ReportLostItemPage from "../features/lost-items/pages/ReportLostItemPage";
import MyLostItemsPage from "../features/lost-items/pages/MyLostItemsPage";
import LostItemDetailsPage from "../features/lost-items/pages/LostItemDetailsPage";
import { LostItemsProvider } from "../features/lost-items/lost-items.context";

import FoundItemsPage from "../features/found-items/pages/FoundItemsPage";
import FoundItemDetailsPage from "../features/found-items/pages/FoundItemDetailsPage";
import RegisterFoundItemPage from "../features/found-items/pages/RegisterFoundItemPage";
import { FoundItemsProvider } from "../features/found-items/found-items.context";

import ItemDetailsPage from "../features/item-details/pages/ItemDetailsPage";

import MyClaimsPage from "../features/claims/pages/MyClaimsPage";
import StaffClaimsPage from "../features/claims/pages/StaffClaimsPage";
import ClaimDetailsPage from "../features/claims/pages/ClaimDetailsPage";
import { ClaimsProvider } from "../features/claims/claims.context";

import MyRecoveriesPage from "../features/recovery/pages/MyRecoveriesPage";
import StaffRecoveriesPage from "../features/recovery/pages/StaffRecoveriesPage";
import RecoveryDetailsPage from "../features/recovery/pages/RecoveryDetailsPage";
import { RecoveryProvider } from "../features/recovery/recovery.context";

import StudentPortalPage from "../features/student/pages/StudentPortalPage";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <LostItemsProvider>
      <FoundItemsProvider>
        <ClaimsProvider>
          <RecoveryProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Public Feed Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Student Self-Service Portal */}
              <Route
                path="/student/portal"
                element={
                  <ProtectedRoute allowedRoles={["student", "faculty"]}>
                    <StudentPortalPage />
                  </ProtectedRoute>
                }
              />

              {/* Staff Operations Dashboard (Staff / Admin only) */}
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <StaffDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Lost Items — Report */}
              <Route
                path="/lost-items/report"
                element={
                  <ProtectedRoute>
                    <ReportLostItemPage />
                  </ProtectedRoute>
                }
              />

              {/* Lost Items — My Reports */}
              <Route
                path="/lost-items/my"
                element={
                  <ProtectedRoute>
                    <MyLostItemsPage />
                  </ProtectedRoute>
                }
              />

              {/* Lost Items — Detail */}
              <Route
                path="/lost-items/:id"
                element={
                  <ProtectedRoute>
                    <LostItemDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Found Items — Browse */}
              <Route
                path="/found-items"
                element={
                  <ProtectedRoute>
                    <FoundItemsPage />
                  </ProtectedRoute>
                }
              />

              {/* Found Items — Register (Staff/Admin only) */}
              <Route
                path="/found-items/register"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <RegisterFoundItemPage />
                  </ProtectedRoute>
                }
              />

              {/* Found Items — Edit (Staff/Admin only) */}
              <Route
                path="/found-items/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <RegisterFoundItemPage />
                  </ProtectedRoute>
                }
              />

              {/* Found Items — Detail */}
              <Route
                path="/found-items/:id"
                element={
                  <ProtectedRoute>
                    <FoundItemDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Generic Item Details — Unified Route */}
              <Route
                path="/items/:type/:id"
                element={
                  <ProtectedRoute>
                    <ItemDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Claims — My Claims (Student / Faculty) */}
              <Route
                path="/claims/my"
                element={
                  <ProtectedRoute>
                    <MyClaimsPage />
                  </ProtectedRoute>
                }
              />

              {/* Claims — Manage Claims Queue (Staff / Admin only) */}
              <Route
                path="/claims/manage"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <StaffClaimsPage />
                  </ProtectedRoute>
                }
              />

              {/* Claims — Detail */}
              <Route
                path="/claims/:id"
                element={
                  <ProtectedRoute>
                    <ClaimDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Recoveries — My Recoveries (Student / Faculty) */}
              <Route
                path="/recoveries/my"
                element={
                  <ProtectedRoute>
                    <MyRecoveriesPage />
                  </ProtectedRoute>
                }
              />

              {/* Recoveries — Staff Log (Staff / Admin only) */}
              <Route
                path="/recoveries/staff"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <StaffRecoveriesPage />
                  </ProtectedRoute>
                }
              />

              {/* Recoveries — Detail */}
              <Route
                path="/recoveries/:id"
                element={
                  <ProtectedRoute>
                    <RecoveryDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RecoveryProvider>
        </ClaimsProvider>
      </FoundItemsProvider>
    </LostItemsProvider>
  );
};

export default AppRoutes;
