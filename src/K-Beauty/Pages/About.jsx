import React from 'react'
import video from '../assets/SampleA.mp4'
import video1 from '../assets/SampleB.mp4'
const About = () => {
    return (
        <div className='about-page'>
            <div className='text-center'>
                <h1 className='text-center text-dark mb-0 pb-0'>About <span>Us</span></h1>
                <svg width="200" height="">
                    <line x1="0" y1="13" x2="200" y2="1" stroke="red" stroke-width="8">
                        <animate attributeName="x2" from="0" to="200" dur="2s" repeatCount="1" />
                    </line>
                </svg>
            </div>
            <div className='container pb-lg-5'>
                <div className='row text-dark'>
                    <div className='col-lg-6 '>
                        <video className='about-video' autoPlay loop muted src={video} alt="error"></video>
                    </div>
                    <div className='col-lg-6 p-lg-5'>
                        <h1> What <span>We Are</span></h1>
                        <h6 class="animated-line"></h6>
                        <p className='para'>At KBeautyMart, we are more than just a name—we are a symbol of authentic Korean beauty, innovation, and trust.
                            Our journey began with a vision to redefine skincare excellence by bringing the secrets of K-Beauty to your doorstep.
                            With a strong foundation built on quality, purity, and customer satisfaction,
                            we strive to set new benchmarks in the beauty industry.</p>
                    </div>

                </div>
            </div>
            <div className='container pt-lg-5 pb-lg-5'>
                <div className='row text-dark'>
                    <div className='col-lg-6 p-lg-5'>
                        <h1> Our <span>Philosophy</span></h1>
                        <h6 class="animated-line"></h6>
                        <p className='para ps-lg-0'>We draw inspiration from the world of Korean beauty, embracing natural ingredients, advanced skin science, and innovation. Our name, "KBeautyMart" symbolizes the fusion of tradition and modern skincare excellence, echoing our commitment to helping you achieve your healthiest, most radiant skin.</p>
                    </div>

                    <div className='col-lg-6 '>
                        <video className='about-video' autoPlay loop muted src={video1} alt="error"></video>
                    </div>

                </div>
            </div>

            <section className='container text-center text-dark pt-5'>
                <div>
                    <h2>Join the <span>KBeautyMart Family</span></h2>
                    <span className="moving-line">__________</span>
                    <p className='para'>Whether you're starting a new skincare routine, looking for your holy grail product, or simply pampering yourself, KBeautyMart is your go-to destination for authentic K-Beauty essentials that make you feel radiant and confident.<br /><br />

                        Let's celebrate the beauty of your skin - because your glow tells a story.</p>
                </div>
                <button className='main btn btn-primary'>Shop Now</button>
            </section>
        </div>

    )
}

export default About