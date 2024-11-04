import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import Home from "./components/Home";
import Category from "./components/Category";
import Book from "./components/Book";
import UserInfo from "./components/UserInfo";
import Seller from "./components/Seller";
import VerifiedSeller from "./components/VerifiedSeller";
import Recommend from "./components/Recommend";
import About from "./components/About";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Safety from "./components/Safety";
import AdminBooks from './components/AdminBooks';
import Search from "./components/Search";
import Auth from './components/Auth';

import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState("");
  const [userPic, setUserPic] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch('your-api-endpoint/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error fetching books:', err));

    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      setUserId(user.id);
      setUserData(user);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <>
      <div id="navigation">
        <SideNav userId={userId} userPic={userPic} />
        <div id="mainContent">
          <TopNav />
          <Routes>
            <Route path="/" element={<Home books={books} />} />
            <Route path="category" element={<Category books={books} />} />
            <Route path="category/:catId" element={<Category books={books} />} />
            <Route path="book/:bookId" element={<Book books={books} wishlist={wishlist} setWishlist={setWishlist} user={userId} />} />
            <Route path="about" element={<About />} />
            <Route path="about/terms&condition" element={<Terms />} />
            <Route path="about/privacy-policy" element={<Privacy />} />
            <Route path="about/safety-remarks" element={<Safety />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="search/:option/:search" element={<Search books={books} />} />

            <Route path="seller" element={
              <ProtectedRoute>
                <Seller setVerified={setVerified} verified={verified} user={userId} />
              </ProtectedRoute>
            } />
            <Route path="seller/verified" element={
              <ProtectedRoute>
                <VerifiedSeller verified={verified} userId={userId} user={userData} />
              </ProtectedRoute>
            } />
            <Route path="recommend" element={
              <ProtectedRoute>
                <Recommend />
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute>
                <AdminBooks />
              </ProtectedRoute>
            } />
            <Route path="user/:userId" element={
              <ProtectedRoute>
                <UserInfo books={books} currUser={userId} userData={userData} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
