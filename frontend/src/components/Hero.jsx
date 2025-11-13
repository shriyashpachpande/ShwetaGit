import { useEffect } from "react";
import gsap from "gsap";
import videoFile from "../assets/home.mp4"; // ✅ Apna video import karo
import HeroButtons from "./HeroButtons";
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    useEffect(() => {
        // GSAP Animation
        gsap.fromTo(
            ".hero-element",
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.3, 
                duration: 1,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <section className="relative m-0 p-0  w-full h-screen flex flex-col justify-center items-center overflow-hidden">
            {/* 🔥 Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            >
                <source src={videoFile} type="video/mp4" />
            </video>

            {/* 🔥 Content */}
            <div className="text-center text-white px-4 space-y-12 transform -translate-y-10 md:-translate-y-16">
                <p
                    className="hero-element text-sm md:text-base lg:text-lg bg-white/20 text-black px-4  rounded-full inline-block"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                >
                    {t('AI AUTOMATION FOR BUSINESSES')}
                </p>

                <h1 className="hero-element text-4xl md:text-6xl text-black font-bold mt-4">
                    DocBot + ClauseSense
                </h1>
                <p className="hero-element text-lg md:text-xl mt-2 text-black ">
                    {t('AI-powered medical insights and insurance clarity—empowering every patient with instant, trusted answers')}
                </p>
                
                <HeroButtons/>
            </div>
        </section>
    );
};

export default Hero;
