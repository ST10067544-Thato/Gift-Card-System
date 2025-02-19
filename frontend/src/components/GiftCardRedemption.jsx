import React, { useState, useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, CheckCircle, Search } from "lucide-react";

// Reusable GiftCardDetails Component to display the details of a gift card
const GiftCardDetails = ({ card, isDisabled = false, onRedeem, isAdmin = false }) => (
  <div className={`bg-gray-50 p-4 rounded-lg shadow-md mt-4 ${isDisabled ? "opacity-50" : ""}`}>
    <p className="text-gray-700"><strong>Card Code:</strong> {card.code}</p>
    <p className="text-gray-700"><strong>Balance:</strong> {card.balance}</p>
    <p className="text-gray-700"><strong>Expiry Date:</strong> {card.expiry}</p>
    <p className={`${isDisabled ? "text-red-600" : "text-green-600"} font-bold flex items-center`}>
      {/* Display lock icon for disabled status and check circle for active status */}
      {isDisabled ? <Lock className="inline w-4 h-4 mr-2" /> : <CheckCircle className="inline w-4 h-4 mr-2" />}
      {card.status}
    </p>
    {!isDisabled && (
      <Button
        onClick={onRedeem} // Redeem action triggered by button click
        className="mt-3 w-full bg-redeemInStore hover:bg-yellow-600 text-white rounded-lg transition-all duration-300"
      >
        {isAdmin ? "Redeem" : "Redeem In Store"}
      </Button>
    )}
  </div>
);

// Authorization modal to verify PIN before redeeming gift card
const AuthorizationModal = ({ userRole, isAuthRequired, onApprove, onCancel, pin, setPin, title }) => (
  isAuthRequired && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-red-500">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600 text-center">{title}</h2>
          <Input
            type="password"
            placeholder={`Enter ${userRole === "store" ? "Manager" : "Admin"} PIN`} // Placeholder depends on user role
            value={pin}
            onChange={(e) => setPin(e.target.value)} // Update PIN on change
            className="rounded-lg focus:ring-2 focus:ring-red-500"
          />
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
  // State variables to manage gift card segments and user authentication
  const [giftCardSegments, setGiftCardSegments] = useState(["", "", "", ""]);
  const [cardDetails, setCardDetails] = useState(null);
  const [isManagerAuth, setIsManagerAuth] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [managerPin, setManagerPin] = useState("");
  const [adminPin, setAdminPin] = useState("");

  // Handle input change for the last 4 digits of the gift card
  const handleInputChange = useCallback((e, index) => {
    const value = e.target.value;
    if (value.length <= 4) { // Limit input to 4 characters
      setGiftCardSegments((prev) => {
        const newSegments = [...prev];
        newSegments[index] = value;
        return newSegments;
      });
    }
  }, []);

  // Handle the search for gift card by constructing the full code and updating state
  const handleSearch = useCallback(() => {
    if (giftCardSegments[3].trim()) {
      const fullGiftCardCode = `****-****-****-${giftCardSegments[3]}`;

      // Mock response with card details
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
  }, [giftCardSegments]);

  // Trigger authentication based on user role (admin or manager)
  const handleRedeem = useCallback(() => {
    userRole === "admin" ? setIsAdminAuth(true) : setIsManagerAuth(true);
  }, [userRole]);

  // Handle approval after authentication to redeem the card
  const handleApproval = useCallback(() => {
    alert("Gift card redeemed successfully!"); // Mock success message
    setIsManagerAuth(false);
    setIsAdminAuth(false);
    setCardDetails(null); // Reset card details
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-primary text-center">Enter the Last 4 Digits of Gift Card</h2>

          {/* Display gift card segments as input fields */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <React.Fragment key={index}>
                <Input
                  maxLength={4}
                  placeholder="****"
                  value="****"
                  disabled
                  className="w-20 bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg"
                />
                {index < 3 && <span className="self-center text-gray-500">-</span>}
              </React.Fragment>
            ))}
            <Input
              maxLength={4}
              placeholder="####"
              value={giftCardSegments[3]} // Display the last 4 digits of the card
              onChange={(e) => handleInputChange(e, 3)} // Update state when user types
              className="w-20 rounded-lg focus:ring-2 focus:ring-primaryLight"
            />
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            <span className="font-medium text-primary">Note:</span> This is case-sensitive.
          </p>

          {/* Button to trigger gift card search */}
          <Button onClick={handleSearch} className="mt-3 w-full bg-primary hover:bg-primaryDark text-white rounded-lg transition-all duration-300">
            <Search className="inline w-4 h-4 mr-2" /> Search
          </Button>

          {/* Display card details once the card is found */}
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

      {/* Show authorization modal when manager or admin authentication is required */}
      <AuthorizationModal
        userRole={userRole}
        isAuthRequired={isManagerAuth || isAdminAuth}
        onApprove={handleApproval}
        onCancel={() => {
          setIsManagerAuth(false);
          setIsAdminAuth(false);
        }}
        pin={userRole === "store" ? managerPin : adminPin}
        setPin={userRole === "store" ? setManagerPin : setAdminPin}
        title={userRole === "store" ? "Manager Authorization" : "Admin Authorization"}
      />
    </div>
  );
}
