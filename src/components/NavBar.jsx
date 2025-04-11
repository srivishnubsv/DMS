import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SignIn from "./SignIn";

function NavBar() {
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear any stored tokens or state
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Survey App</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              {user ? user.email || "Signed In User" : "Guest"}
            </span>
            {!user ? (
              <button
                onClick={() => setShowSignIn(true)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>
      <SignIn isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
}

export default NavBar;
