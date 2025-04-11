import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import SignIn from "./SignIn";

function NavBar() {
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth);
      }
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.isAnonymous) return "Anonymous User";
    return user.displayName || user.email || "Signed In User";
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Survey App</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">{getUserDisplayName()}</span>
            {user?.isAnonymous ? (
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
