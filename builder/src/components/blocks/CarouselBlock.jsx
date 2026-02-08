import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip } from 'swiper/modules';
import clsx from 'clsx';

// Generic Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';

// Custom CSS for Swiper container to fit editor
import './CarouselBlock.css';

export const CarouselBlock = ({
    slides = [],
    autoplayEnabled = true,
    autoplayDelay = 3000,
    showArrows = true,
    showDots = true,
    effect = 'slide', // slide, fade, cube, coverflow, flip
    objectFit = 'cover',
    height = '400px'
}) => {

    // Modules configuration based on props (though importing all is usually fine)
    const modules = [Navigation, Pagination, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip];

    // State for Active Modal
    const [activeModalInfo, setActiveModalInfo] = React.useState(null);

    return (
        <div className="w-full h-full relative group">
            <Swiper
                modules={modules}
                observer={true}
                observeParents={true}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={autoplayEnabled ? {
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                } : false}
                navigation={showArrows}
                pagination={showDots ? { clickable: true } : false}
                effect={effect}
                // Effect specific configs
                cubeEffect={{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }}
                coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
                flipEffect={{ slideShadows: true }}
                fadeEffect={{ crossFade: true }}

                className="w-full h-full overflow-hidden"
                style={{ borderRadius: 'inherit' }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id || index} className="w-full h-full">
                        <div className="w-full h-full relative">
                            <img
                                src={slide.src}
                                alt={`Slide ${index}`}
                                className="w-full h-full pointer-events-none select-none" // Disable drag on img to allow swiper drag
                                style={{
                                    objectFit: objectFit || 'cover',
                                    borderWidth: slide.borderWidth ? `${slide.borderWidth}px` : '0px',
                                    borderColor: slide.borderColor || 'transparent',
                                    borderStyle: slide.borderWidth > 0 ? 'solid' : 'none',
                                    borderRadius: slide.borderRadius ? `${slide.borderRadius}px` : '0px'
                                }}
                            />

                            {/* Smart Slide Button */}
                            {slide.showButton && (
                                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
                                    <button
                                        // Use pointer-events-auto so the button is clickable even if container isn't
                                        className="pointer-events-auto bg-white/90 hover:bg-white text-black font-bold py-2 px-6 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent swiper drag/click
                                            setActiveModalInfo(slide);
                                        }}
                                    >
                                        {slide.buttonText || 'Ver Detalles'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}

                {slides.length === 0 && (
                    <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400">
                        <p>No slides configured</p>
                    </div>
                )}
            </Swiper>

            {/* Info Modal Portal/Overlay */}
            {activeModalInfo && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveModalInfo(null)}>
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                    >
                        {/* Modal Header Image */}
                        <div className="h-48 w-full relative">
                            <img src={activeModalInfo.src} alt={activeModalInfo.modalTitle} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setActiveModalInfo(null)}
                                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeModalInfo.modalTitle || 'Detalles'}</h3>
                            <div className="prose prose-sm text-gray-600 max-h-[60vh] overflow-y-auto">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {activeModalInfo.modalContent || 'Sin descripción disponible.'}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setActiveModalInfo(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
