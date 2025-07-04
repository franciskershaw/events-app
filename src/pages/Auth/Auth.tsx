import { useEffect, useRef } from "react";

import {
  FaFilter,
  FaGoogle,
  FaMobileAlt,
  FaTags,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useUser from "@/hooks/user/useUser";
import usePageTitle from "@/hooks/utility/usePageTitle";

import LocalForm from "./components/LocalForm/LocalForm";
import OrDivider from "./components/OrDivider/OrDivider";

const features = [
  {
    title: "Smart Event Categorisation",
    description:
      "Tag your events as gigs, holidays, reminders, and more. Instantly filter and search your calendar by what matters most.",
    icon: <FaTags className="text-primary text-3xl" />,
  },
  {
    title: "Share & Connect",
    description:
      "Connect with friends, share your plans, and see what others are up to—while keeping private events hidden.",
    icon: <FaUsers className="text-primary text-3xl" />,
  },
  {
    title: "Mobile & Desktop Views",
    description:
      "Enjoy a streamlined list view on mobile, or a full calendar grid on desktop. Organisey adapts to your device.",
    icon: <FaMobileAlt className="text-primary text-3xl" />,
  },
  {
    title: "Advanced Filtering",
    description:
      "Combine categories, locations, and dates to find exactly what you need. Share filtered event lists with a link.",
    icon: <FaFilter className="text-primary text-3xl" />,
  },
];

const screenshots = [
  { src: "/screenshot1.png", alt: "Mobile screenshot 1" },
  { src: "/screenshot2.png", alt: "Mobile screenshot 2" },
  { src: "/screenshot3.png", alt: "Desktop screenshot" },
];

const Auth = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const loginRef = useRef<HTMLDivElement>(null);

  usePageTitle("Welcome to Organisey");

  useEffect(() => {
    if (user) {
      return navigate("/events");
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleScrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-primary-lightest min-h-screen w-full flex flex-col space-y-8 md:space-y-16">
      {/* Hero Section */}
      <section className="px-4 text-center bg-gradient-to-b from-primary-light to-primary-lightest flex flex-col items-center space-y-6 pt-16">
        <Heading
          type="h1"
          fontWeight="font-bold"
          className="text-4xl md:text-5xl"
        >
          Organisey
        </Heading>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto md:pb-6">
          The calendar app reimagined: smarter event organisation, powerful
          filtering, and seamless sharing—built for how you actually plan your
          life.
        </p>
        <Button
          size="lg"
          className="text-lg px-8 py-4 shadow-lg md:py-6 md:px-10 md:text-xl"
          onClick={handleScrollToLogin}
        >
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section className="px-4 max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-background rounded-lg shadow p-6 border flex flex-col items-center text-center space-y-2"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center">
        <div className="h-1 w-32 bg-primary rounded-full opacity-30" />
      </div>

      {/* Screenshots Section (hidden on mobile) */}
      <section className="px-4 max-w-5xl mx-auto hidden md:flex flex-row items-center justify-center gap-8">
        {/* Left mobile screenshot */}
        <img
          src={screenshots[0].src}
          alt={screenshots[0].alt}
          className="rounded-lg border shadow-md max-w-[180px] w-full object-cover"
          loading="lazy"
        />
        {/* Desktop screenshot center */}
        <img
          src={screenshots[2].src}
          alt={screenshots[2].alt}
          className="rounded-lg border shadow-md w-full max-w-[600px] object-cover"
          loading="lazy"
        />
        {/* Right mobile screenshot */}
        <img
          src={screenshots[1].src}
          alt={screenshots[1].alt}
          className="rounded-lg border shadow-md max-w-[180px] w-full object-cover"
          loading="lazy"
        />
      </section>

      {/* Login Section */}
      <section
        ref={loginRef}
        className="px-4 bg-background border-t flex flex-col items-center space-y-6 py-16"
      >
        <Heading
          type="h2"
          fontWeight="font-semibold"
          className="text-center text-2xl"
        >
          Log in or sign up to get started
        </Heading>
        <p className="text-muted-foreground text-center max-w-md">
          Start organising your life in a smarter way. Sign up or log in to
          begin creating, sharing, and discovering events!
        </p>
        <div className="bg-background flex flex-col items-center border rounded-sm p-8 w-full max-w-[400px] shadow-lg space-y-4">
          {/* Google Login Button */}
          <Button
            throttleClicks
            onClick={handleGoogleLogin}
            className="w-full gap-3"
          >
            <FaGoogle size={24} />
            <span className="text-lg">Login with Google</span>
          </Button>
          <OrDivider />
          {/* Form goes here */}
          <div className="w-full">
            <LocalForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
