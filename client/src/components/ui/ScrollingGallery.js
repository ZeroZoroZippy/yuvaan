import React from 'react';

function ScrollingGallery() {
    const galleryItems = [
        { id: 1, image: "https://picsum.photos/seed/coffee/400/400", alt: "Coffee & Code", label: "Coffee & Code" },
        { id: 2, image: "https://picsum.photos/seed/workspace/400/400", alt: "My Workspace", label: "My Workspace" },
        { id: 3, image: "https://picsum.photos/seed/football/400/400", alt: "Football Passion", label: "Football Passion" },
        { id: 4, image: "https://picsum.photos/seed/cooking/400/400", alt: "Kitchen Experiments", label: "Kitchen Experiments" },
        { id: 5, image: "https://picsum.photos/seed/dog/400/400", alt: "Best Friend", label: "Best Friend" },
        { id: 6, image: "https://picsum.photos/seed/movies/400/400", alt: "Movie Night", label: "Movie Night" }
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
                                    <p className="text-white font-medium text-sm sm:text-base">{item.label}</p>
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
                                    <p className="text-white font-medium text-sm sm:text-base">{item.label}</p>
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