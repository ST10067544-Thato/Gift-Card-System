import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";

// Mock details of Redeemed Gift Cards 
const AdminPage = () => {
  const [disabledCards] = useState([
    {
      id: 1,
      code: "****-****-****-1234",
      balance: "R500.00",
      status: "Redeemed In-Store",
      store: "centurion@store.co.za",
      date: "2023-10-01 14:30",
    },
    {
      id: 2,
      code: "****-****-****-5678",
      balance: "R200.00",
      status: "Redeemed In-Store",
      store: "brooklyn@store.co.za",
      date: "2023-10-02 10:15",
    },
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Redeemed Gift Cards Dashboard Table */}
      <Card className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        <CardContent>
          <h2 className="text-2xl font-bold text-primary text-center mb-6">Redeemed Gift Cards</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Gift Card Code</th>
                  <th className="px-4 py-2 text-left">Balance</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Store Branch/Email</th>
                  <th className="px-4 py-2 text-left">Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {disabledCards.map((card) => (
                  <tr key={card.id} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-gray-700">{card.code}</td>
                    <td className="px-4 py-2 text-gray-700">{card.balance}</td>
                    <td className="px-4 py-2 text-gray-700">{card.status}</td>
                    <td className="px-4 py-2 text-gray-700">{card.store}</td>
                    <td className="px-4 py-2 text-gray-700">{card.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;