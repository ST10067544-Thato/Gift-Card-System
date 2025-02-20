import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, CheckCircle, Search, XCircle } from "lucide-react";

const ADMIN_PIN = "1234";
const MANAGER_PIN = "5678";

/**
 * Displays gift card details and redemption button.
 */
const GiftCardDetails = ({ card, isDisabled = false, onRedeem, isAdmin = false }) => (
  <div className={`bg-gray-50 p-4 rounded-lg shadow-md mt-4 ${isDisabled ? "opacity-50" : ""}`}>
    <p className="text-gray-700"><strong>Card Code:</strong> {card.code}</p>
    <p className="text-gray-700"><strong>Balance:</strong> {card.balance}</p>
    <p className="text-gray-700"><strong>Expiry Date:</strong> {card.expiry}</p>
    <p className={`${isDisabled ? "text-red-600" : "text-green-600"} font-bold flex items-center`}>
      {isDisabled ? <Lock className="inline w-4 h-4 mr-2" /> : <CheckCircle className="inline w-4 h-4 mr-2" />}
      {card.status}
    </p>
    {!isDisabled && (
      <Button onClick={onRedeem} className="mt-3 w-full bg-redeemInStore hover:bg-yellow-600 text-white rounded-lg transition-all duration-300">
        {isAdmin ? "Redeem" : "Redeem In Store"}
      </Button>
    )}
  </div>
);

/**
 * Modal for PIN entry when manager or admin approval is required.
 */
const AuthorizationModal = ({ userRole, isAuthRequired, onApprove, onCancel, pin, setPin, error }) => (
  isAuthRequired && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-red-500">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600 text-center">
            {userRole === "store" ? "Manager Authorization" : "Admin Authorization"}
          </h2>
          <Input
            type="password"
            placeholder={`Enter ${userRole === "store" ? "Manager" : "Admin"} PIN`}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-lg focus:ring-2 focus:ring-red-500"
          />
          {error && (
            <p className="text-red-500 text-sm flex items-center">
              <XCircle className="w-4 h-4 mr-2" /> Incorrect PIN, try again.
            </p>
          )}
          <div className="flex space-x-2">
            <Button onClick={onApprove} className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300">
              <CheckCircle className="inline w-4 h-4 mr-2" /> Approve
            </Button>
            <Button onClick={onCancel} className="mt-3 w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300">
              <Lock className="inline w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
);

export default function GiftCardRedemption({ userRole }) {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // Auto-clear incorrect PIN message after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle input change for gift card (allows letters & numbers, max 4 chars)
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4);
    setGiftCardCode(value);
  };

  // Fetch gift card details
  const handleSearch = () => {
    if (giftCardCode.length === 4) {
      setCardDetails({
        code: `****-****-****-${giftCardCode}`,
        balance: "R500.00",
        expiry: "12/31/2025",
        status: "Active",
        secondaryCard: `****-****-****-${giftCardCode}`,
      });
    } else {
      alert("Please enter exactly 4 characters for the gift card.");
    }
  };

  // Initiate redemption process
  const handleRedeem = () => {
    setIsAuthRequired(true);
  };

  // Handle PIN approval logic
  const handleApproval = useCallback(() => {
    const correctPin = userRole === "admin" ? ADMIN_PIN : MANAGER_PIN;
    
    if (pin === correctPin) {
      alert("Gift card redeemed successfully!");

      // Reset everything after successful redemption
      setGiftCardCode("");
      setCardDetails(null);
      setIsAuthRequired(false);
      setPin("");
      setError(false);
    } else {
      setError(true);
    }
  }, [pin, userRole]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-primary text-center">Enter the Last 4 Digits of Gift Card</h2>

          {/* Input for the last 4 digits */}
          <div className="flex space-x-2">
            <Input value="****" disabled className="w-20 bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg" />
            <span className="self-center text-gray-500">-</span>
            <Input value="****" disabled className="w-20 bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg" />
            <span className="self-center text-gray-500">-</span>
            <Input value="****" disabled className="w-20 bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg" />
            <span className="self-center text-gray-500">-</span>
            <Input
              maxLength={4}
              placeholder="####"
              value={giftCardCode}
              onChange={handleInputChange}
              className="w-20 rounded-lg focus:ring-2 focus:ring-primaryLight"
            />
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            <span className="font-medium text-primary">Note:</span> This is case-sensitive.
          </p>

          {/* Search button */}
          <Button onClick={handleSearch} className="mt-3 w-full bg-primary hover:bg-primaryDark text-white rounded-lg transition-all duration-300">
            <Search className="inline w-4 h-4 mr-2" /> Search
          </Button>

          {/* Display gift card details if available */}
          {cardDetails && (
            <>
              <GiftCardDetails card={cardDetails} onRedeem={handleRedeem} isAdmin={userRole === "admin"} />
              <GiftCardDetails
                card={{
                  code: cardDetails.secondaryCard,
                  balance: "R0.00",
                  expiry: "01/01/2023",
                  status: "Expired/Used",
                }}
                isDisabled
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Authorization modal */}
      <AuthorizationModal
        userRole={userRole}
        isAuthRequired={isAuthRequired}
        onApprove={handleApproval}
        onCancel={() => {
          setIsAuthRequired(false);
          setError(false);
        }}
        pin={pin}
        setPin={setPin}
        error={error}
      />
    </div>
  );
}
