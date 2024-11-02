import { Route, Routes } from "react-router-dom";
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
import Chat from "./components/Chat";

import { auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';


function App() {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState("");
  const [userPic, setUserPic] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const booksRef = collection(db, "books");
    const q = query(booksRef, orderBy("bookID"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });


    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uId = user.email.split("@")[0];
        setUserId(uId);
        setUserPic(user.photoURL);

        // fetching user details if exists else will add to the database
        const userDocRef = doc(db, "users", uId);
        getDoc(userDocRef).then((docSnap) => {
          if (!docSnap.exists()) {
            const newUser = {
              name: user.displayName,
              email: user.email,
              image: user.photoURL,
              wishlist: [],
              verified: false,
            };
            setDoc(userDocRef, newUser);
            setUserData(newUser);
          } else {
            const userData = docSnap.data();
            setUserData(userData);
            setWishlist(userData.wishlist || []);
            setVerified(userData.verified || false);
          }
        });
      } else {
        setUserId("");
        setUserPic("");
        setWishlist([]);
        setVerified(false);
        setUserData({});
      }
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);
  console.log("App render", { books, userId, userPic, wishlist, verified, userData });

  return (
    <>
      <div id="navigation">
        <SideNav userId={userId} userPic={userPic} />
        <div id="mainContent">
          <TopNav />
          <Routes>
            <Route path="/" element={<Home books={books} />} />
            <Route path="category" element={<Category books={books} />} />
            <Route
              path="category/:catId"
              element={<Category books={books} />}
            />
            <Route
              path="book/:bookId"
              element={
                <Book
                  books={books}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  user={userId}
                />
              }
            />
            <Route
              path="seller"
              element={
                <Seller
                  setVerified={setVerified}
                  verified={verified}
                  user={userId}
                />
              }
            />
            <Route
              path="seller/verified"
              element={
                <VerifiedSeller
                  verified={verified}
                  userId={userId}
                  user={userData}
                />
              }
            />
            <Route path="recommend" element={<Recommend />} />
            <Route path="about" element={<About />} />
            <Route path="about/terms&condition" element={<Terms />} />
            <Route path="about/privacy-policy" element={<Privacy />} />
            <Route path="about/safety-remarks" element={<Safety />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route
              path="user/:userId"
              element={
                <UserInfo books={books} currUser={userId} userData={userData} />
              }
            />
            <Route
              path="search/:option/:search"
              element={<Search books={books} />}
            />
            <Route path="chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
