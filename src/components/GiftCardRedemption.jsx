import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, CheckCircle, Search } from "lucide-react";

export default function GiftCardRedemption() {
  const [giftCard, setGiftCard] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const [isManagerAuth, setIsManagerAuth] = useState(false);
  const [managerPin, setManagerPin] = useState("");

  const handleSearch = () => {
    // Simulate fetching gift card data
    setCardDetails({
      code: "XXXX-XXXX",
      balance: "R500.00",
      expiry: "12/31/2025",
      status: "Active",
    });
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
          <h2 className="text-2xl font-bold text-red-600 text-center">Gift Card Redemption</h2>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Gift Card Code"
              value={giftCard}
              onChange={(e) => setGiftCard(e.target.value)}
            />
            <Button onClick={handleSearch} className="bg-red-500 hover:bg-red-700 text-white">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {cardDetails && (
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <p><strong>Card Code:</strong> {cardDetails.code}</p>
              <p><strong>Balance:</strong> {cardDetails.balance}</p>
              <p><strong>Expiry Date:</strong> {cardDetails.expiry}</p>
              <p className={"text-green-600 font-bold"}><CheckCircle className="inline w-4 h-4" /> {cardDetails.status}</p>
              <Button onClick={handleRedeem} className="mt-3 w-full bg-green-500 hover:bg-green-700 text-white">
                Redeem (Manager Approval Required)
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
              <Button onClick={handleManagerApproval} className="w-full bg-blue-500 hover:bg-blue-700 text-white">
                <CheckCircle className="w-5 h-5" /> Approve
              </Button>
              <Button onClick={() => setIsManagerAuth(false)} className="w-full bg-gray-500 hover:bg-gray-700 text-white">
                <Lock className="w-5 h-5" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
