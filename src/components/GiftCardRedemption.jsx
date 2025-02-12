import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, CheckCircle, Search } from "lucide-react";

export default function GiftCardRedemption() {
  // State for each segment of the gift card code
  const [giftCardSegments, setGiftCardSegments] = useState(["", "", "", ""]);
  const [cardDetails, setCardDetails] = useState(null);
  const [isManagerAuth, setIsManagerAuth] = useState(false);
  const [managerPin, setManagerPin] = useState("");

  // Handle input change for each segment with max length restriction
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    // Update the respective segment if value is 4 characters or less
    if (value.length <= 4) {
      const newSegments = [...giftCardSegments];
      newSegments[index] = value;
      setGiftCardSegments(newSegments);
    }
  };

  // Combine the gift card segments into one string
  const handleSearch = () => {
    // Check if all segments are filled (no empty characters)
    if (giftCardSegments.every(segment => segment.trim() !== "")) {
      const fullGiftCardCode = giftCardSegments.join("-");
      console.log("Searching for gift card:", fullGiftCardCode);

      // Simulate fetching gift card data
      setCardDetails({
        code: fullGiftCardCode,
        balance: "R500.00",
        expiry: "12/31/2025",
        status: "Active",
      });
    } else {
      alert("Please enter a valid gift card code.");
    }
  };

  const handleRedeem = () => {
    setIsManagerAuth(true);
  };

  const handleManagerApproval = () => {
    // Simulate manager authorization
    alert("Gift card redeemed successfully!");
    setIsManagerAuth(false);
    setCardDetails(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-red-500">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600 text-center">Enter a Gift Card Number</h2>

          <div className="flex space-x-2">
            {/* 4 Separate Input Boxes for the Gift Card Code */}
            {giftCardSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <Input
                  maxLength={4}
                  placeholder="####"
                  value={segment}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-20"
                />
                {index < 3 && <span>-</span>} {/* Show dashes only between segments */}
              </React.Fragment>
            ))}
          </div>

          <Button onClick={handleSearch} className="mt-3 w-full bg-red-500 hover:bg-red-700 text-white">
            <Search className="inline w-4 h-4 mr-1" /> {/* Add margin-right */}
            Search
          </Button>

          {cardDetails && (
            <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
              <p><strong>Card Code:</strong> {cardDetails.code}</p>
              <p><strong>Balance:</strong> {cardDetails.balance}</p>
              <p><strong>Expiry Date:</strong> {cardDetails.expiry}</p>
              <p className="text-green-600 font-bold">
                <CheckCircle className="inline w-4 h-4" /> {cardDetails.status}
              </p>
              <Button onClick={handleRedeem} className="mt-3 w-full bg-green-500 hover:bg-green-700 text-white">
                Redeem In Store
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isManagerAuth && (
        <Card className="mt-6 w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-500">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-600 text-center">Manager Authorization</h2>
            <Input
              type="password"
              placeholder="Enter Manager PIN"
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleManagerApproval} className="mt-3 w-full bg-blue-500 hover:bg-blue-700 text-white">
                <CheckCircle className="inline w-4 h-4" /> Approve
              </Button>
              <Button onClick={() => setIsManagerAuth(false)} className="mt-3 w-full bg-gray-500 hover:bg-gray-700 text-white">
                <Lock className="inline w-4 h-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
