import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import NavBar from "./components/NavBar";
import SurveyDesigner from "./components/SurveyDesigner";

function App() {
  useEffect(() => {
    const initAuth = async () => {
      const user = auth.currentUser;
      if (!user) {
        await signInAnonymously(auth);
      }
    };

    initAuth();
  }, []);

  return (
    <Router>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<SurveyDesigner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
