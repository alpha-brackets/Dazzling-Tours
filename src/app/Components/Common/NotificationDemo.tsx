"use client";
import React from "react";
import { useNotification } from "@/lib/hooks";

const NotificationDemo: React.FC = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    hideNotification,
    clearAll,
  } = useNotification();

  const handleSuccess = () => {
    showSuccess("Operation completed successfully!", {
      title: "Success",
      action: {
        label: "View Details",
        onClick: () => console.log("View details clicked"),
      },
    });
  };

  const handleError = () => {
    showError("Something went wrong. Please try again.", {
      title: "Error",
      duration: 8000,
    });
  };

  const handleWarning = () => {
    showWarning("Please review your input before proceeding.", {
      title: "Warning",
    });
  };

  const handleInfo = () => {
    showInfo("New features are available in the latest update.", {
      title: "Information",
    });
  };

  const handleLoading = () => {
    const id = showLoading("Processing your request...", {
      title: "Loading",
    });

    // Simulate async operation
    setTimeout(() => {
      hideNotification(id);
      showSuccess("Request completed successfully!");
    }, 3000);
  };

  return (
    <div className="notification-demo p-4">
      <h3 className="mb-4">Notification System Demo</h3>
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-success" onClick={handleSuccess}>
          Show Success
        </button>
        <button className="btn btn-danger" onClick={handleError}>
          Show Error
        </button>
        <button className="btn btn-warning" onClick={handleWarning}>
          Show Warning
        </button>
        <button className="btn btn-info" onClick={handleInfo}>
          Show Info
        </button>
        <button className="btn btn-primary" onClick={handleLoading}>
          Show Loading
        </button>
        <button className="btn btn-secondary" onClick={clearAll}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default NotificationDemo;
