import { Routes, Route } from "react-router-dom";
import Product from "../Product"
import Skincare from "../categories/Skincare";
import BestSellersPage from "../SinglesPage/BestSellerPage";
import SkinCarePage from "../SinglesPage/SkinCarePage";
import MakeupPage from "../SinglesPage/MakeupPage";
import ProductSingle from "../DetailsPage/ProductSingle";
import IngredientProducts from "../Pages/IngredientProducts";
import BrandProducts from "../Pages/BrandProducts";
import HairCarePage from "../SinglesPage/HairCarePage";
import ShopAll from "../Pages/ShopAll";
import Login from "../Login";
import Signup from "../Signup";
import Logout from "../Logout";
import About from "../Pages/About";
import BrandLogos from "../Components/BrandLogos";
import Contact from "../Pages/Contact";
import Faq from "../Pages/Faq";
import BlogSection from "../Components/BlogSection";
import NoPage from "../Pages/NoPage";
import Checkin from "../Admin/Checkin";
import Dashboard from "../Admin/Dashboard";
import CartPage from "../Pages/CartPage";
import Order from "../Order";
import AccountPage from "../AccountPage";
import LipCarePage from "../SinglesPage/LipCarePage";
import Wishlist from "../Wishlist";
import AdminRoute from "./AdminRoute";
import PhoneLogin from "../Pages/PhoneLogin";

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/About" element={<About />} />
            <Route path="/brandlogo" element={<BrandLogos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/blog" element={<BlogSection />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            {/* Admin Routes Restricted to Role: Admin */}
            <Route path="/checkin" element={<AdminRoute><Checkin /></AdminRoute>} />
            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<Order />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/Account" element={<AccountPage />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            {/* Generic Product Route */}
            <Route path="/product/:id" element={<ProductSingle />} />
            {/* BestSellers */}
            <Route path="/BestSellers" element={<BestSellersPage />} />
            <Route path='/BestSellers/:id' element={<ProductSingle />} />
            {/* SkinCare */}
            <Route path="/SkinCare" element={<SkinCarePage />} />
            <Route path='/SkinCare/:id' element={<ProductSingle />} />
            {/* Makeup */}
            <Route path="/Makeup" element={<MakeupPage />} />
            <Route path='/Makeup/:id' element={<ProductSingle />} />
            {/* HairCare */}
            <Route path="/HairCare" element={<HairCarePage />} />
            <Route path='/HairCare/:id' element={<ProductSingle />} />
            {/* LipCare */}
            <Route path="/LipCare" element={<LipCarePage />} />
            <Route path='/LipCare/:id' element={<ProductSingle />} />
            {/* Ingredients */}
            <Route path="/ingredient/:name" element={<IngredientProducts />} />
            {/* Brands */}
            <Route path="/brand/:brandName" element={<BrandProducts />} />
            {/* PhoneLogin */}
            <Route path="/mobile-login" element={<PhoneLogin />} />
            {/* 404 Page */}
            <Route path="/shop" element={<ShopAll />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
    );
};

export default Routing;
