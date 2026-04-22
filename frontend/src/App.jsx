// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Account from './pages/Account';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentMethods from './pages/PaymentMethods';
import Privacy from './pages/Privacy';
import ProductDetails from './pages/ProductDetails';
import ProductLists from './pages/ProductLists';
// import Register from './pages/Register';
import ReturnPolicy from './pages/ReturnPolicy';
import SearchResults from './pages/SearchResults';
import ShippingInfo from './pages/ShippingInfo';
import Support from './pages/Support';
import Tos from './pages/Tos';



function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category" element={<Category />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product-lists" element={<ProductLists />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/shipping-info" element={<ShippingInfo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/tos" element={<Tos />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;