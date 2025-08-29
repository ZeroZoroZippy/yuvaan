import React from 'react';
import OptimizedImage from './OptimizedImage';
import wirefrme from '../assets/About/wireframe.jpeg';
import code from '../assets/About/code.jpeg';

function DesignStrategySection() {
    return (
        <section className="px-0 sm:px-2 lg:px-4 py-8 sm:py-16 lg:py-24">
            <div className="w-full max-w-6xl mx-auto">
                <h2
                    className="text-3xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-12"
                    style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}
                >
                    Design with Strategy and Creativity
                </h2>
                <p
                    className="text-xl sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed max-w-2xl mb-8 sm:mb-12 lg:mb-20"
                    style={{ fontFamily: 'Neuton, serif' }}
                >
                    Every great digital experience starts with understanding the why behind the what. I combine strategic thinking with creative execution to build solutions that not only look exceptional but solve real problems for real people.
                </p>

                {/* Container Grid - Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
                    {/* Process Step 01 */}
                    <div
                        className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#161711] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>01.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#161711] mb-2 sm:mb-3" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Research & Strategy</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#161711]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                In this phase, I dive deep into understanding your business, target audience, and project goals. Through research and strategic planning, I create a clear roadmap to guide the entire design process.
                            </p>
                        </div>
                    </div>

                    {/* Image 1 */}
                    <div
                        className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <OptimizedImage src="https://picsum.photos/seed/research/300/300" alt="User research and analysis phase for healthcare website design showing data collection, patient interviews, and medical practice market research materials used by Yuvaan Vithlani to understand user needs and accessibility requirements" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" lazy={true} />
                    </div>

                    {/* Process Step 02 */}
                    <div
                        className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>02.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Concept & Ideation</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                Here, I brainstorm and develop creative concepts that align with your vision. Initial sketches and ideas are refined into tangible wireframes, setting the direction for design and functionality.
                            </p>
                        </div>
                    </div>

                    {/* Image 2 */}
                    <div
                        className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <OptimizedImage src={wirefrme} alt="Design ideation and wireframing process for healthcare websites showing sketches, patient user flow diagrams, and initial design concepts focused on accessibility and medical practice needs by Yuvaan Vithlani" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" lazy={true} />
                    </div>

                    {/* Process Step 03 - Spans 2 columns on larger screens */}
                    <div
                        className="md:col-span-2 bg-[#A8977A] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#45372B] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>03.</h2>
                        <div className="self-start max-w-2xl">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#45372B] mb-2 sm:mb-3" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Feedback & Refinement</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#45372B] leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                Collaboration is key. I review the design with you, gather feedback, and refine the work to align with your expectations and goals. This ensures the design reflects your vision.
                            </p>
                        </div>
                    </div>

                    {/* Process Step 04 */}
                    <div
                        className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>04.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Testing & Optimization</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                I conduct thorough testing to identify and resolve any performance or usability issues. This phase ensures the design works seamlessly across devices and meets user experience standards.
                            </p>
                        </div>
                    </div>

                    {/* Image 3 */}
                    <div
                        className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <OptimizedImage src={code} alt="Development and testing phase for healthcare websites showing responsive code implementation, accessibility testing, quality assurance, and patient user testing procedures by Yuvaan Vithlani ensuring HIPAA compliance and optimal user experience" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" lazy={true} />
                    </div>

                    {/* Process Step 05 */}
                    <div
                        className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#161711] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>05.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#161711] mb-2 sm:mb-3" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Launch & Delivery</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#161711]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                Once everything is finalized, the project is launched and delivered to you. I also provide guidance or support for ongoing maintenance to ensure long-term success.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DesignStrategySection;