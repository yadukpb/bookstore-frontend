import React, { useEffect, useState } from "react";
import "./CSS/book.css";
import locationIcon from "./images/Books/locationIcon.png";
import rupeeIcon from "./images/Books/rupee.png";
import wishlistIcon from "./images/Books/wishlist.png";
import removeIcon from "./images/Books/remove.png";
import telegramIcon from "./images/Books/TelegramIcon.png";
import { NavLink, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'react-qr-code';

import { db } from "../firebase";

function Book({ books, wishlist, setWishlist, user }) {
  const bookId = parseInt(useParams().bookId);
  const [book, setBook] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    setBook(books[bookId]);
    const mainBook = document.querySelector(".currentBookPage");
    const allCover = document.querySelectorAll(".bookOptionImage");
    let curr = allCover[0];
    mainBook.setAttribute("src", curr.getAttribute("src"));
    curr.classList.add("bookDetailImageActive");
    allCover.forEach((image) => {
      image.addEventListener("mouseenter", () => {
        mainBook.setAttribute("src", image.getAttribute("src"));
        curr.classList.remove("bookDetailImageActive");
        image.classList.add("bookDetailImageActive");
        curr = image;
      });
    });
  }, [bookId, books]);

  const showSignInToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTelegramConnect = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in to connect via Telegram', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  function onClickWishlist() {
    if (!user) {
      toast.error('Please sign in to add to wishlist', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const index = wishlist?.indexOf(bookId);
    if (index > -1) {
      setWishlist((prevWishlist) => {
        const newWishList = prevWishlist.filter((id) => id !== bookId);
        db.collection("users").doc(user).update({ wishlist: newWishList });
        toast.success('Book removed from wishlist');
        return newWishList;
      });
    } else {
      setWishlist((prevWishlist) => {
        const newWishList = [...prevWishlist, bookId];
        db.collection("users").doc(user).update({ wishlist: newWishList });
        toast.success('Book added to wishlist');
        return newWishList;
      });
    }
  }

  const paymentAmount = (book?.price * 0.1).toFixed(2);
  const googlePayQRCode = "https://example.com/temporary-qr-code"; // Replace with actual QR code URL

  const handlePayment = () => {
    setPaymentDone(true);
    toast.success('Payment successful!');
  };

  return (
    <section className="bookDetailSection">
      <div className="bookDetailsContainer">
        <div className="bookDetailsImages">
          <div className="bookDetailsImagesOption">
            <img
              className="bookOptionImage"
              src={book?.bookFront}
              alt="book front"
            />
            <img
              className="bookOptionImage"
              src={book?.bookIndex}
              alt="book index"
            />
            <img
              className="bookOptionImage"
              src={book?.bookMiddle}
              alt="book middle"
            />
            <img
              className="bookOptionImage"
              src={book?.bookBack}
              alt="book back"
            />
          </div>
          <img
            className="currentBookPage"
            src={book?.bookFront}
            alt="book front"
          />
        </div>
        <div className="bookDetailDivider"></div>
        <div className="bookDetailsAbout">
          <h1>{book?.name}</h1>
          <div className="bookDetailsUser">
            <div className="bookDetailsUserLocation">
              <img src={locationIcon} alt="location" />
              <p>{book?.location}</p>
            </div>
            <ul>
              <li>
                Sold by&nbsp;
                <NavLink
                  to={`/user/${book?.sellerId}`}
                  target="_blank"
                  className="bookDetailsUserInfo">
                  {book?.seller}
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="bookDetailsPrice">
            <div className="bookDetailsCurrPrice" title="Current price">
              <img src={rupeeIcon} alt="rupee" />
              <p>{book?.price}</p>
            </div>
            <p title="Market price">MRP : ₹{book?.mrp}</p>
          </div>
          {!paymentDone && (
            <div className="bookDetailsDescription">
              <h3 className="gradient_head">Description</h3>
              <p>{book?.description}</p>
            </div>
          )}
          <div className="bookDetailsOthers">
            <p>
              <span>Publisher</span> {book?.publisher}
            </p>
            <p>
              <span>Edition(year)</span> {book?.edition}
            </p>
            <p>
              <span>Category</span> {book?.category}
            </p>
          </div>
          <div className="bookDetailUserConnect">
            {!paymentDone ? (
              <button className="payButton" onClick={handlePayment}>
                Pay <span className="amount">₹{paymentAmount}</span>
              </button>
            ) : (
              <div>
                <QRCode className="qrCode" value={googlePayQRCode} />
                <p>Scan to pay with Google Pay</p>
              </div>
            )}
            <button
              className="bookDuserConnect wishlist"
              onClick={onClickWishlist}>
              <img
                src={wishlist?.includes(bookId) ? removeIcon : wishlistIcon}
                alt="wishlist"
              />
              <p>
                {wishlist?.includes(bookId) ? "Remove from" : "Add to"}
                <span>Wishlist</span>
              </p>
            </button>
            {paymentDone && (
              <a
                href={`https://t.me/${book?.telegram}`}
                target="_blank"
                rel="noreferrer"
                onClick={handleTelegramConnect}>
                <button className="bookDuserConnect telegramConnect">
                  <img src={telegramIcon} alt="telegram" />
                  <p>
                    Connect on <span>Telegram</span>
                  </p>
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast">
          Please sign in to perform this action
        </div>
      )}
      <ToastContainer />
    </section>
  );
}

export default Book;