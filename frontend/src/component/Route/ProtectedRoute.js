import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { loading, isAuthenticated, user, isAdmin } = useSelector((state) => state.user);
  return (
    loading === false && (
      isAuthenticated || (isAdmin === true && user.role !== "admin") ? <Outlet /> : <Navigate to='/login' />
    )
  )
}

export default ProtectedRoute;
