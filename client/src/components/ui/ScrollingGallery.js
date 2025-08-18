import React from 'react';
import G1 from '../../assets/Gallery/G1.JPG'
import G2 from '../../assets/Gallery/G2.jpg'
import G3 from '../../assets/Gallery/G3.JPG'
import G4 from '../../assets/Gallery/G4.jpg'
import G5 from '../../assets/Gallery/G5.jpg'
import G6 from '../../assets/Gallery/G6.jpg'
import G7 from '../../assets/Gallery/G7.jpg'
import G8 from '../../assets/Gallery/G8.JPG'
import G9 from '../../assets/Gallery/G9.jpg'

function ScrollingGallery() {
    const galleryItems = [
        { id: 1, image: G1, alt: "Puppy"},
        { id: 2, image: G8, alt: "My Workspace"},
        { id: 3, image: G3, alt: "Outing" },
        { id: 4, image: G5, alt: "Lucy", label: "Lucy" },
        { id: 5, image: G6, alt: "Lara", label: "Lara" },
        { id: 6, image: G9, alt: "Pose" }
    ];

    return (
        <section className="w-full overflow-hidden">
            <div className="w-full overflow-hidden">
                <div className="flex animate-scroll space-x-4 sm:space-x-6" style={{ width: '200%' }}>
                    {/* First set of images */}
                    <div className="flex space-x-4 sm:space-x-6 shrink-0">
                        {galleryItems.map((item) => (
                            <div key={`first-${item.id}`} className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-lg relative group">
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                                    <p className="text-white font-medium text-sm sm:text-base" style={{ fontFamily: 'Neuton, serif' }}>{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Duplicate set for seamless loop */}
                    <div className="flex space-x-4 sm:space-x-6 shrink-0">
                        {galleryItems.map((item) => (
                            <div key={`second-${item.id}`} className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-lg relative group">
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                                    <p className="text-white font-medium text-sm sm:text-base" style={{ fontFamily: 'Neuton, serif' }}>{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ScrollingGallery;