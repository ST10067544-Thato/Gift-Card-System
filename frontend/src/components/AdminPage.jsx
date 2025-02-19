// src/components/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import DateFilter from "./DateFilter";
import Papa from "papaparse";
import { debounce } from "lodash";
import { Button } from "./ui/button";

const AdminPage = () => {
  // State hooks for search term, store filter, and date filter
  const [searchTerm, setSearchTerm] = useState(""); 
  const [storeFilter, setStoreFilter] = useState(""); 
  const [dateFilter, setDateFilter] = useState(""); 
  const [dateOption, setDateOption] = useState(""); 

  // Sample data for disabled (redeemed) gift cards
  const disabledCards = [
    { id: 1, code: "****-****-****-1234", balance: "R500.00", status: "Redeemed In-Store", store: "centurion@toykingdom.co.za", date: "2025-10-01 14:30" },
    { id: 2, code: "****-****-****-5678", balance: "R200.00", status: "Redeemed In-Store", store: "brooklyn@toykingdom.co.za", date: "2025-10-02 10:15" },
    { id: 3, code: "****-****-****-9876", balance: "R150.00", status: "Redeemed Online", store: "sandton@toykingdom.co.za", date: "2025-10-03 12:45" },
    { id: 4, code: "****-****-****-1111", balance: "R600.00", status: "Redeemed In-Store", store: "pretoria@toykingdom.co.za", date: "2025-10-04 09:00" },
    { id: 5, code: "****-****-****-2222", balance: "R120.00", status: "Redeemed Online", store: "durban@toykingdom.co.za", date: "2025-10-05 16:15" },
    { id: 6, code: "****-****-****-3333", balance: "R250.00", status: "Redeemed In-Store", store: "pe@toykingdom.co.za", date: "2025-10-06 14:45" },
    { id: 7, code: "****-****-****-4444", balance: "R350.00", status: "Redeemed Online", store: "nelspruit@toykingdom.co.za", date: "2025-10-07 11:30" },
  ];

  const [currentPage, setCurrentPage] = useState(1); // State for current page in pagination
  const itemsPerPage = 6; // Number of items displayed per page

  // Debounced function to search for gift cards based on the code
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);
  

  // Filter cards by date based on the selected filter option (year, month, or exact date)
  const filterByDate = (card) => {
    const cardDate = new Date(card.date);
    const selectedDate = dateFilter ? new Date(dateFilter) : null;

    if (dateOption === "year" && selectedDate) {
      return cardDate.getFullYear() === selectedDate.getFullYear();
    }

    if (dateOption === "month" && selectedDate) {
      return cardDate.getMonth() === selectedDate.getMonth() && cardDate.getFullYear() === selectedDate.getFullYear();
    }

    return !selectedDate || cardDate.toLocaleDateString() === selectedDate.toLocaleDateString();
  };

  // Update page number whenever the filters are applied
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever filters are updated
  }, [searchTerm, storeFilter, dateFilter]);

  // Filter the disabled cards based on search, store, and date filter
  const filteredCards = disabledCards.filter((card) => {
    return (
      (card.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (storeFilter === "" || card.store.toLowerCase().includes(storeFilter.toLowerCase())) &&
      filterByDate(card)
    );
  });;

  // Calculate total pages based on filtered cards
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  // Slice the filtered cards based on the current page
  const currentCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change (previous and next)
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle exporting data to CSV
  const handleExport = () => {
    const csvData = Papa.unparse(filteredCards);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "redeemed_gift_cards.csv";
    a.click();
  };

  // Handle date change from DateFilter component
  const handleDateChange = (option, value) => {
    setDateOption(option);
    setDateFilter(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 sm:p-8 pt-24">
      <Card className="w-full sm:w-auto bg-white shadow-md rounded-lg p-6 sm:p-8 border-t-4 border-primary transform transition duration-300 ease-in-out">
        <CardContent>
          <h2 className="text-3xl font-semibold text-center text-primary mb-6">Gift Cards Redeemed</h2>

          {/* Filters for searching gift cards and selecting stores */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:flex-nowrap mb-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto sm:flex-nowrap">
              <input
                type="text"
                className="px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary w-full sm:w-36 whitespace-nowrap"
                placeholder="Search Code"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              <select
                className="px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary w-full sm:w-36 mt-4 sm:mt-0 whitespace-nowrap"
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
              >
                <option value="">All Stores</option>
                {/* Add store options */}
                <option value="centurion@toykingdom.co.za">Centurion</option>
                <option value="brooklyn@toykingdom.co.za">Brooklyn</option>
                <option value="sandton@toykingdom.co.za">Sandton</option>
                <option value="pretoria@toykingdom.co.za">Pretoria</option>
                <option value="durban@toykingdom.co.za">Durban</option>
                <option value="pe@toykingdom.co.za">PE</option>
                <option value="nelspruit@toykingdom.co.za">Nelspruit</option>
              </select>
            </div>

            {/* Date filter component */}
            <DateFilter onChange={handleDateChange} />
          </div>

          {/* Display filtered gift cards or message if no cards found */}
          {filteredCards.length === 0 ? (
            <p className="text-center text-gray-500">No redeemed gift cards found.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-gray-800">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Gift Card Code</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Amount</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Store</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {currentCards.map((card, index) => (
                    <tr
                      key={card.id}
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{card.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{card.balance}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{card.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{card.store}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{card.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination and Export buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between items-center">
            <div className="flex space-x-4 items-center sm:order-1 sm:flex-nowrap">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg p-2"
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center text-gray-600 text-sm">
                <span className="font-medium">Page {currentPage} of {totalPages}</span>
              </div>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg p-2"
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>

            <Button
              onClick={handleExport}
              className="mt-4 sm:mt-0 sm:order-2 bg-primary text-white rounded-lg px-6 py-2"
            >
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
