import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lock, CheckCircle, Search, XCircle, Info } from "lucide-react";

// Component to display gift card details and a redemption button
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

// Modal for Manager or Admin TOTP verification
const AuthorizationModal = ({
  isAuthRequired,
  onApprove,
  onCancel,
  totp,
  setTotp,
  error,
  errorMessage,
  qrCodeUrl,
  secret,
  userRole,
  isLoading,
}) => (
  isAuthRequired && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-red-500">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold text-red-600 text-center">
            {userRole === "store" ? "Manager Authorization" : "Admin Authorization"}
          </h2>
          {/* TOTP Setup for both Admin and Manager */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              {qrCodeUrl ? (
                <>
                  <div className="flex justify-center mt-4">
                    <img src={qrCodeUrl} alt="TOTP QR Code" className="w-40 h-40 rounded-lg shadow-lg" />
                  </div>
                  <p className="text-gray-600 text-center mt-4 text-sm">
                    <Info className="inline w-5 h-5 mr-2 text-red-500" /> 
                    Scan the QR code or manually enter the code below into your authenticator app, then enter the generated code here.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg mt-4 flex justify-center items-center">
                    <p className="text-sm text-gray-700 font-mono break-all text-center">
                      {secret}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center mt-4 text-sm">
                  <Info className="inline w-5 h-5 mr-2 text-red-500" /> Your account is already linked to an authenticator app. Enter the code from your app below.
                </p>
              )}
            </>
          )}
          <Input
            type="text"
            placeholder="Enter Authentication Code"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            className="mt-4 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          {error && (
            <p className="text-red-500 text-sm flex items-center justify-center mt-4">
              <XCircle className="w-4 h-4 mr-2" /> {errorMessage || "Invalid code, try again."}
            </p>
          )}
          <div className="flex space-x-2 mt-6">
            <Button onClick={onApprove} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300">
              <CheckCircle className="inline w-4 h-4 mr-2" /> Approve
            </Button>
            <Button onClick={onCancel} className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300">
              <Lock className="inline w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
);

// Main component for gift card redemption
export default function GiftCardRedemption({ userRole }) {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [totp, setTotp] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(false);
  const [secret, setSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const userEmail = sessionStorage.getItem("userEmail"); // Get email from sessionStorage
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Auto-clear error message after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle input change for gift card code
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4);
    setGiftCardCode(value);
  };

  // Handle search for gift card details
  const handleSearch = () => {
    if (giftCardCode.length === 4) {
      setIsSearching(true); // Start loading animation

      // Simulate a delay for fetching data (e.g., 1.5 seconds)
      setTimeout(() => {
        setCardDetails({
          code: `****-****-****-${giftCardCode}`,
          balance: "R500.00",
          expiry: "12/31/2025",
          status: "Active",
          secondaryCard: `****-****-****-${giftCardCode}`,
        });
        setIsSearching(false); // Stop loading animation
      }, 1500); // Adjust the delay as needed
    } else {
      alert("Please enter exactly 4 characters for the gift card.");
    }
  };

  // Handle closing the authorization modal
  const handleCloseModal = () => {
    setIsAuthRequired(false); // Close the modal
    setTotp(""); // Clear the TOTP input
    setQrCodeUrl(null); // Reset QR code URL
    setSecret(null); // Reset secret
    setError(false); // Clear any errors
  };

  // Initiate redemption process with Axios
  const handleRedeem = async () => {
    setIsAuthRequired(true);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/setup-totp`, {
        email: userEmail.toLowerCase(),
      });

      const data = response.data;

      if (data.hasTotp) {
        setQrCodeUrl(null);
        setSecret(null);
      } else if (data.qrCodeUrl) {
        setQrCodeUrl(data.qrCodeUrl);
        setSecret(data.secret);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approval for redemption with Axios
  const handleApproval = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-totp`, {
        email: userEmail.toLowerCase(),
        code: totp,
      });

      const data = response.data;

      if (data.token) {
        alert("Gift card redeemed successfully!");
        resetState();
      } else {
        setError(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setError(true);
    }
  }, [totp, API_BASE_URL, userEmail]);

  // Reset state after successful redemption
  const resetState = () => {
    setGiftCardCode("");
    setCardDetails(null);
    setIsAuthRequired(false);
    setTotp("");
    setQrCodeUrl(null);
    setError(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border-t-4 border-primary">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-primary text-center">Enter the Last 4 Digits of Gift Card</h2>
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
          <Button onClick={handleSearch} className="mt-3 w-full bg-primary hover:bg-primaryDark text-white rounded-lg transition-all duration-300">
            <Search className="inline w-4 h-4 mr-2" /> Search
          </Button>
          {/* Loading animation */}
          {isSearching && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {/* Display card details after loading */}
          {!isSearching && cardDetails && (
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
      <AuthorizationModal
        isAuthRequired={isAuthRequired}
        onApprove={handleApproval}
        onCancel={handleCloseModal}
        totp={totp}
        setTotp={setTotp}
        error={error}
        errorMessage={errorMessage}
        qrCodeUrl={qrCodeUrl}
        secret={secret}
        userRole={userRole}
        isLoading={isLoading}
      />
    </div>
  );
}