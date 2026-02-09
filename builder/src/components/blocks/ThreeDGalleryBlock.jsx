import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';

export const ThreeDGalleryBlock = ({
    images = [],
    rotate = 50,
    stretch = 0,
    depth = 100,
    shadow = true
}) => {
    // Default placeholder images if empty
    const displayImages = images.length > 0 ? images : [
        'https://swiperjs.com/demos/images/nature-1.jpg',
        'https://swiperjs.com/demos/images/nature-2.jpg',
        'https://swiperjs.com/demos/images/nature-3.jpg',
        'https://swiperjs.com/demos/images/nature-4.jpg',
        'https://swiperjs.com/demos/images/nature-5.jpg',
    ];

    return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <style>
                {`
                .swiper-3d-gallery {
                    width: 100%;
                    padding-top: 50px;
                    padding-bottom: 50px;
                }
                .swiper-3d-gallery .swiper-slide {
                    background-position: center;
                    background-size: cover;
                    width: 300px;
                    height: 400px;
                    /* Responsive */
                    max-width: 80%;
                    max-height: 80%;
                }
                .swiper-3d-gallery .swiper-slide img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }
                `}
            </style>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: rotate,
                    stretch: stretch,
                    depth: depth,
                    modifier: 1,
                    slideShadows: shadow,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination]}
                className="swiper-3d-gallery"
            >
                {displayImages.map((img, index) => {
                    const src = typeof img === 'string' ? img : img.src;
                    return (
                        <SwiperSlide key={index}>
                            <img src={src} alt={`Gallery item ${index}`} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};
