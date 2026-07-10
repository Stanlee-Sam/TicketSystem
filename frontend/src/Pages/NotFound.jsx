import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-secondary">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition-colors hover:bg-primary-soft">
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
