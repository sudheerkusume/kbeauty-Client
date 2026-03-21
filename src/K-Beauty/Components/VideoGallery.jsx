import React from 'react';
import './VideoGallery.css';
import SampleA from '../assets/SampleA.mp4';
import SampleB from '../assets/SampleB.mp4';
import SampleC from '../assets/SampleC.mp4';
import SampleD from '../assets/SampleD.mp4';

const VideoGallery = () => {
    const videos = [
        { id: 1, src: SampleA, title: "Glow Routine" },
        { id: 2, src: SampleB, title: "Texture Study" },
        { id: 3, src: SampleC, title: "Ingredient Focus" },
        { id: 4, src: SampleD, title: "Skin Transformation" },
    ];

    return (
        <section className="video-gallery-section py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <span className="gallery-subtitle">K-Beauty in Motion</span>
                    <h2 className="gallery-title">Shop the Look</h2>
                </div>
                <div className="row g-3">
                    {videos.map((video) => (
                        <div className="col-6 col-md-3" key={video.id}>
                            <div className="video-card-luxe">
                                <video
                                    src={video.src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="gallery-video"
                                />
                                <div className="video-overlay">
                                    <span className="video-tag">{video.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VideoGallery;
