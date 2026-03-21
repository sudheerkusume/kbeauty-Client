import TrendingProducts from './Components/TrendingProducts';
import KoreanCollection from './Components/KoreanCollection';
import OffersSection from './Components/OffersSection';
import ReviewsSection from './Components/ReviewsSection';
import Hero from './Pages/Hero';
import Categories from './categories/Categories';
import BestSellers from './categories/BestSeller';
import TrustBar from './Components/TrustBar';
import BrandLogos from './Components/BrandLogos';
import ExpertBacking from './Components/ExpertBacking';
import BlogSection from './Components/BlogSection';
import VideoGallery from './Components/VideoGallery';
import IngredientSection from './Components/IngredientSection';
import IconPage from './Pages/IconPage';
import Navpage from './Pages/Navpage';
import Banner from './Pages/Banner';
import ShippingDetails from './Components/ShippingDetails';

const Product = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-cream)' }}>
            <Hero />
            <IconPage />
            <Navpage />
            <OffersSection />
            <Banner />
            <BestSellers />
            <Categories />
            <ExpertBacking />
            <TrendingProducts />
            <ShippingDetails />
            <KoreanCollection />
            <BrandLogos />

            {/* <IngredientSection /> */}
            <BlogSection />
            <VideoGallery />
            <ReviewsSection />
        </div>
    )
}

export default Product