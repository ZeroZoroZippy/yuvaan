import React from 'react';
import OptimizedImage from './OptimizedImage';
import wirefrme from '../assets/About/wireframe.jpeg';
import code from '../assets/About/code.jpeg';
import work from '../assets/About/work.jpg';

function DesignStrategySection() {
    return (
        <section className="px-0 sm:px-2 lg:px-4 py-8 sm:py-16 lg:py-24">
            <div className="w-full max-w-6xl mx-auto">
                <h2
                    className="text-3xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-12"
                    style={{ fontFamily: 'var(--font-sans)' }}
                >
                    How I Work
                </h2>
                <p
                    className="text-xl sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed max-w-2xl mb-8 sm:mb-12 lg:mb-20"
                    style={{ fontFamily: 'var(--font-sans)' }}
                >
                    The through-line in my work is not a single industry or output. It is the way I break ambiguity down: understand the problem, find the system underneath it, prototype clearly, and keep refining until the product feels calmer and more usable.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
                    <div className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#161711] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'var(--font-sans)' }}>01.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#161711] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Define The Real Problem</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#161711]/80 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                                I try to understand what is actually wrong before jumping to solutions. A lot of noise disappears once the real user tension is named properly.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <OptimizedImage
                            src={work}
                            alt="Workspace image representing research, problem framing, and systems thinking in Yuvaan Vithlani's process"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            lazy={true}
                        />
                    </div>

                    <div className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'var(--font-sans)' }}>02.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Structure The System</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                                Once the problem is clearer, I look for the structure underneath it: flows, constraints, decisions, and what the user actually needs to understand next.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <OptimizedImage
                            src={wirefrme}
                            alt="Wireframe and layout imagery representing systems thinking, structure, and early product framing"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            lazy={true}
                        />
                    </div>

                    <div className="md:col-span-2 bg-[#A8977A] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#45372B] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'var(--font-sans)' }}>03.</h2>
                        <div className="self-start max-w-2xl">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#45372B] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Prototype Fast, Think Clearly</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#45372B] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                                AI is useful to me because it accelerates thinking, prototyping, and iteration. I use it as a layer for exploration and clarity, not as a substitute for judgment.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'var(--font-sans)' }}>04.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Refine Through Reality</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                                Feedback, constraints, and changing business context are part of the work. I like refining in motion rather than pretending the first idea is already the answer.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <OptimizedImage
                            src={code}
                            alt="Code and implementation imagery representing prototyping, testing, and refinement in product execution"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            lazy={true}
                        />
                    </div>

                    <div className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#161711] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'var(--font-sans)' }}>05.</h2>
                        <div className="self-start">
                            <h3 className="text-3xl sm:text-2xl lg:text-3xl font-medium text-[#161711] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Ship Something Clearer</h3>
                            <p className="text-xl sm:text-base lg:text-lg text-[#161711]/80 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                                Whether it is a client website, a BI module, or an AI experiment, I want the result to reduce confusion and help someone move forward with more confidence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DesignStrategySection;
