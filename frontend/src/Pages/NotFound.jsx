import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="text-body-lg text-secondary mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-colors font-label-bold">
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;