import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, CheckCircle, Search } from "lucide-react";

export default function GiftCardRedemption() {
  // State to store the four segments of the gift card number
  const [giftCardSegments, setGiftCardSegments] = useState(["", "", "", ""]);
  // State to store the retrieved gift card details
  const [cardDetails, setCardDetails] = useState(null);
  // State to manage manager authorization
  const [isManagerAuth, setIsManagerAuth] = useState(false);
  // State to store the manager's PIN input
  const [managerPin, setManagerPin] = useState("");

  // Handles changes in the gift card input fields
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 4) {
      const newSegments = [...giftCardSegments];
      newSegments[index] = value;
      setGiftCardSegments(newSegments);
    }
  };

  // Simulates searching for a gift card based on the last 4 digits
  const handleSearch = () => {
    if (giftCardSegments[3].trim() !== "") {
      const fullGiftCardCode = `****-****-****-${giftCardSegments[3]}`;
      console.log("Searching for gift card:", fullGiftCardCode);

      // Mock data for gift card details
      setCardDetails({
        code: fullGiftCardCode,
        balance: "R500.00",
        expiry: "12/31/2025",
        status: "Active",
        secondaryCard: `****-****-****-${giftCardSegments[3]}`,
      });
    } else {
      alert("Please enter the last 4 digits of the gift card.");
    }
  };

  // Initiates the manager authorization process for redemption
  const handleRedeem = () => {
    setIsManagerAuth(true);
  };

  // Handles manager approval for gift card redemption
  const handleManagerApproval = () => {
    alert("Gift card redeemed successfully!");
    setIsManagerAuth(false);
    setCardDetails(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Gift Card Entry Section */}
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-primary text-center">Enter the Last 4 Digits of Gift Card</h2>

          {/* Input fields for gift card segments (first 3 segments are masked) */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <React.Fragment key={index}>
                <Input
                  maxLength={4}
                  placeholder="****"
                  value="****"
                  disabled
                  className="w-20 bg-gray-200 text-gray-500 cursor-not-allowed"
                />
                {index < 3 && <span>-</span>}
              </React.Fragment>
            ))}
            <Input
              maxLength={4}
              placeholder="####"
              value={giftCardSegments[3]}
              onChange={(e) => handleInputChange(e, 3)}
              className="w-20"
            />
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            <span className="font-medium text-primary">Note:</span> This is case-sensitive.
          </p>

          {/* Search Button */}
          <Button onClick={handleSearch} className="mt-3 w-full bg-primary hover:bg-primaryDark text-white">
            <Search className="inline w-4 h-4 mr-1" />
            Search
          </Button>

          {/* Display Gift Card Details if Available */}
          {cardDetails && (
            <>
              <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
                <p><strong>Card Code:</strong> {cardDetails.code}</p>
                <p><strong>Balance:</strong> {cardDetails.balance}</p>
                <p><strong>Expiry Date:</strong> {cardDetails.expiry}</p>
                <p className="text-green-600 font-bold">
                  <CheckCircle className="inline w-4 h-4" /> {cardDetails.status}
                </p>
                {/* Redeem Button */}
                <Button onClick={handleRedeem} className="mt-3 w-full bg-redeemInStore hover:bg-yellow-700 text-white">
                  Redeem In Store
                </Button>
              </div>

              {/* Secondary Gift Card (Example of Expired/Used Card) */}
              <div className="bg-gray-100 p-4 rounded-lg shadow mt-4 opacity-50">
                <p><strong>Card Code:</strong> {cardDetails.secondaryCard}</p>
                <p><strong>Balance:</strong> R0.00</p>
                <p><strong>Expiry Date:</strong> 01/01/2023</p>
                <p className="text-red-600 font-bold">
                  <Lock className="inline w-4 h-4" /> Expired/Used
                </p>
                {/* Disabled Button for Expired/Used Card */}
                <Button disabled className="mt-3 w-full bg-gray-400 text-gray-700 cursor-not-allowed">
                  Not Redeemable
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Manager Authorization Modal */}
      {isManagerAuth && (
        <Card className="mt-6 w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-red-500">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 text-center">Manager Authorization</h2>
            {/* Input for Manager PIN */}
            <Input
              type="password"
              placeholder="Enter Manager PIN"
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
            />
            <div className="flex space-x-2">
              {/* Approve Button */}
              <Button onClick={handleManagerApproval} className="mt-3 w-full bg-red-500 hover:bg-red-700 text-white">
                <CheckCircle className="inline w-4 h-4" /> Approve
              </Button>
              {/* Cancel Button */}
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
