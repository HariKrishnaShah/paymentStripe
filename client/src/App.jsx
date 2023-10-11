import { BrowserRouter, Routes, Route } from "react-router-dom";

import About from "./pages/About";
import AdminProducts from "./pages/admin/Products";
import Footer from "./layouts/Footer";
import NavBar from "./layouts/Navbar";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
// import Sidebar from "./layouts/Sidebar";
import Payment from "./pages/Payment";

import { PrivateRoute } from "./components/Routes";
import Checkout from "./pages/Checkout";
import { CheckoutPage } from "./components/CheckoutStatus";

const adminRoutes = [
  { path: "/dashboard", component: "", role: "admin" },
  { path: "/products", component: <AdminProducts />, role: "admin" },
  { path: "/orders", component: <AdminProducts />, role: "admin" },
  { path: "/users", component: "", role: "admin" },
];

function App() {
  return (
    <>
      <div className="d-flex flex-column h-100">
        <BrowserRouter>
          {/* <Sidebar /> */}
          <NavBar />
          <main className="flex-shrink-0">
            <div className="container">
              <Routes>
                <Route path="/" element= {<Home />} />
                <Route path="/about" element= {<About />} />
                <Route path="/cart" element= {<Cart />} />
                <Route path="/checkout" element= {<Checkout />} />
                <Route path="/checkout/success" element= {<CheckoutPage />} />
                <Route path="/payment" element= {<Payment />} />
                <Route
                  path="/checkout/failed"
                  element= {<CheckoutPage
                    type="failed"
                    msgHeader="Transaction Failed"
                    msg="Something went wrong. Try again."
                  />}
                />
                <Route path="/contact" element= {<Contact />} />
                <Route path="/login" element= {<Login />} />
                <Route path="/products" element= {<Products />} />
                {adminRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={`/admin${route?.path}`}
                    element={
                      <PrivateRoute role={route?.role}>
                        {route?.component}
                      </PrivateRoute>
                    }
                  />
                ))}
                <Route path="/products/:id" element= {<ProductDetail />} />
                <Route path="*" element= {<ErrorPage />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

/*
Admin
/admin/* (check )
Public
/* (no check)


Public
Private  (Roles based check)
Protected (Valid JWT Token check)
*/
