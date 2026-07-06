import React from "react";
import Navbar from "../../Components/Navbar";

const MyTickets = () => {
  return (
    <div className="">
      <Navbar />
      <h1 className="text-2xl font-bold text-primary mb-6">My Tickets</h1>
      <p className="text-body-lg text-secondary">
        Your tickets will appear here...
      </p>
    </div>
  );
};

export default MyTickets;