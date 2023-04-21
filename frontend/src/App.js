import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/layout/Header/Header.js";
import Home from "./component/Home/Home.js";
import Footer from "./component/layout/Footer/Footer.js";
import React, { useEffect, useState, Fragment, Suspense } from "react";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import Cart from "./component/Cart/Cart.js";
import store from "./store";
import Payment from "./component/Cart/Payment";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import UpdatePassword from "./component/User/UpdatePassword";
import UpdateProfile from "./component/User/UpdateProfile";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import ElementsLayout from "./component/Route/ElementsLayout "
import { useSelector } from "react-redux";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import Shipping from "./component/Cart/Shipping.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import { loadUser } from './actions/userAction';
import { loadStripe } from "@stripe/stripe-js";
import MyOrders from "./component/Order/MyOrders.js";
import Profile from "./component/User/Profile";
import UserOptions from "./component/layout/Header/UserOptions.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";

import axios from "axios";




function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  //Get our Stripe(Payment Api)
  // const stripePromise = loadStripe('pk_test_51MnnMiSJSEx7GAMC1U3hdu6Idm0QiXAZ6m8twER2eOm2azGqit0AjNGIT6fL1wazxIt0A96K0Q0r5Q4AXIVUY6pE00vXjtHIdC');
  const [stripeApiKey, setStripeApiKey] = useState(process.env.STRIPE_API_KEY);
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey();

  }, []);

 // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (

    <Suspense>
      <BrowserRouter>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/about" element={<About />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="/login" element={<LoginSignUp />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route exact path="/password/reset/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/account' element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/me/update' element={<UpdateProfile />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/password/update' element={<UpdatePassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/shipping' element={<Shipping />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/order/confirm' element={<ConfirmOrder />} />
          </Route>
          <Route path="/account" element={<Profile />} />
          {stripeApiKey && (
            <Route
              element={<ElementsLayout stripe={loadStripe(stripeApiKey)} />}
            >
              <Route path="/process/payment" element={<Payment />} />
            </Route>
          )}
          <Route element={<ProtectedRoute />}>
            <Route path='/success' element={<OrderSuccess />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/orders' element={<MyOrders />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/order/:id' element={<OrderDetails />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/products' element={<ProductList />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/product' element={<NewProduct />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/product/:id' element={<UpdateProduct />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/orders' element={<OrderList />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/order/:id' element={<ProcessOrder />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/users' element={<UsersList />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/user/:id' element={<UpdateUser />} />
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path='/admin/reviews' element={<ProductReviews />} />
          </Route>
          {/* <Route exact path="/cart" element={<Cart />} /> */}

        </Routes>
        <Footer />
      </BrowserRouter>
    </Suspense >
  );
}

export default App;
