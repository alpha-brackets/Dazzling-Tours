"use client";
import React from "react";
import {
  Loading,
  LoadingSpinner,
  LoadingDots,
  LoadingSkeleton,
  LoadingPulse,
  LoadingOverlay,
} from "@/app/Components/Common";

const LoadingDemo = () => {
  const [showOverlay, setShowOverlay] = React.useState(false);

  // Auto-hide overlay after 3 seconds
  React.useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Loading Components Demo</h1>

      <div className="row">
        {/* Spinner Variants */}
        <div className="col-md-6 mb-4">
          <h3>Spinner Variants</h3>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <LoadingSpinner size="xs" color="primary" />
            <LoadingSpinner size="sm" color="secondary" />
            <LoadingSpinner size="md" color="success" />
            <LoadingSpinner size="lg" color="warning" />
            <LoadingSpinner size="xl" color="error" />
          </div>
        </div>

        {/* Dots Variants */}
        <div className="col-md-6 mb-4">
          <h3>Dots Variants</h3>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <LoadingDots size="xs" color="primary" />
            <LoadingDots size="sm" color="secondary" />
            <LoadingDots size="md" color="success" />
            <LoadingDots size="lg" color="warning" />
            <LoadingDots size="xl" color="error" />
          </div>
        </div>

        {/* Skeleton Variants */}
        <div className="col-md-6 mb-4">
          <h3>Skeleton Variants</h3>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <LoadingSkeleton size="xs" color="primary" />
            <LoadingSkeleton size="sm" color="secondary" />
            <LoadingSkeleton size="md" color="success" />
            <LoadingSkeleton size="lg" color="warning" />
            <LoadingSkeleton size="xl" color="error" />
          </div>
        </div>

        {/* Pulse Variants */}
        <div className="col-md-6 mb-4">
          <h3>Pulse Variants</h3>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <LoadingPulse size="xs" color="primary" />
            <LoadingPulse size="sm" color="secondary" />
            <LoadingPulse size="md" color="success" />
            <LoadingPulse size="lg" color="warning" />
            <LoadingPulse size="xl" color="error" />
          </div>
        </div>

        {/* With Text */}
        <div className="col-md-6 mb-4">
          <h3>With Text</h3>
          <div className="d-flex flex-column gap-3">
            <Loading
              variant="spinner"
              size="md"
              color="primary"
              text="Loading data..."
            />
            <Loading
              variant="dots"
              size="md"
              color="secondary"
              text="Processing request..."
            />
            <Loading
              variant="pulse"
              size="md"
              color="success"
              text="Saving changes..."
            />
          </div>
        </div>

        {/* Full Screen Overlay */}
        <div className="col-md-6 mb-4">
          <h3>Full Screen Overlay</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowOverlay(true)}
          >
            Show Loading Overlay
          </button>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="row mt-5">
        <div className="col-12">
          <h3>Usage Examples</h3>
          <div className="card">
            <div className="card-body">
              <h5>Basic Usage:</h5>
              <pre className="bg-light p-3 rounded">
                {`<Loading variant="spinner" size="md" color="primary" text="Loading..." />`}
              </pre>

              <h5 className="mt-3">Preset Components:</h5>
              <pre className="bg-light p-3 rounded">
                {`<LoadingSpinner size="lg" color="primary" text="Loading tours..." />
<LoadingDots size="md" color="secondary" />
<LoadingSkeleton size="sm" color="success" />
<LoadingPulse size="xl" color="warning" />
<LoadingOverlay text="Processing..." />`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Overlay */}
      {showOverlay && (
        <LoadingOverlay
          variant="spinner"
          size="xl"
          color="primary"
          text="Loading application..."
        />
      )}
    </div>
  );
};

export default LoadingDemo;
