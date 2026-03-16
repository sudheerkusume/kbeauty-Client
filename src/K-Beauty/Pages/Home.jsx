import react from "react";
import Video1 from "../assets/SampleA.mp4";
import Video2 from "../assets/SampleB.mp4";
import Video3 from "../assets/SampleC.mp4";
import Video4 from "../assets/SampleD.mp4";
const Home = () => {
    const videoData = [
        { video: Video1, title: "Pure Cleansing" },
        { video: Video2, title: "Hydrating Ritual" },
        { video: Video3, title: "Glass Glow" },
        { video: Video4, title: "Night Repair" }
    ];

    return (
        <div className="home-page">
            <div className='container-fluid px-0'>
                <div className='row g-0'>
                    <div className='col-12'>
                        <div className='model container-fluid'>
                            <div className='row p-5'>
                                {videoData.map((item, index) => (
                                    <div key={index} className='col-md-3 col-sm-6 mb-1'>
                                        <div className='card'>
                                            <video
                                                className='card-video'
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                src={item.video}
                                            />
                                            <div className='card-title1'>
                                                <h3 className='video-heading'>{item.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container-fluid px-0'>
                <div id="mainslide" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#mainslide" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#mainslide" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#mainslide" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>


                    <button className="carousel-control-prev" type="button" data-bs-target="#mainslide" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#mainslide" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/********** scroll-horizontal ********/}
            <div className="stock-ticker mb-4">
                <ul>
                    <li className='minus'>
                        <span className='company'>K-Beauty Mart Collection @2026/-</span>
                        <span className='price'>FREE DELIVERY ON ALL ORDERS</span>
                    </li>
                    <li className='plus'>
                        <span className='company'>K-Beauty Mart Collection @2026/-</span>
                        <span className='price'>NEW ARRIVALS SHIPPED FROM SEOUL</span>
                    </li>
                </ul>
                <ul aria-hidden="true">
                    <li className='minus'>
                        <span className='company'>K-Beauty Mart Collection @2026/-</span>
                        <span className='price'>FREE DELIVERY ON ALL ORDERS</span>
                    </li>
                    <li className='plus'>
                        <span className='company'>K-Beauty Mart Collection @2026/-</span>
                        <span className='price'>NEW ARRIVALS SHIPPED FROM SEOUL</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Home; 