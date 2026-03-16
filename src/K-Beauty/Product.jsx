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

const Product = () => {
    return (
        <div style={{ backgroundColor: '#000' }}>
            <Hero />
            <TrustBar />
            <BestSellers />
            <Categories />
            <ExpertBacking />
            <BrandLogos />
            <TrendingProducts />
            <OffersSection />
            <KoreanCollection />
            <IngredientSection />
            <BlogSection />
            <VideoGallery />
            <ReviewsSection />
        </div>
    )
}

export default Product