const business = {
  businessName: "SmileCare Dental Clinic",

  brandName: "SmileCare",
  brandSubtitle: "Dental Clinic",

  tagline: "Modern dentistry. Personal care.",

  businessType: "Dental Clinic",

  location: "New Delhi",

  hours: "Monday-Saturday, 9 AM-7 PM",

  contact: {
    phone: "DEMO_PHONE",
    email: "DEMO_EMAIL",
  },

  // Keep your existing frontend service objects here
  services: [
    {
      title: "Dental Cleaning",
      description:
        "Professional preventive care designed to keep your teeth clean and your smile healthy.",
      icon: "01",
    },
    {
      title: "Teeth Whitening",
      description:
        "Brighten your smile with a personalized whitening experience.",
      icon: "02",
    },
    {
      title: "Root Canal",
      description:
        "Comfort-focused treatment to help protect your natural tooth.",
      icon: "03",
    },
    {
      title: "Dental Consultation",
      description:
        "Get expert guidance and a personalized plan for your dental needs.",
      icon: "04",
    },
  ],

  appointment: {
    available: true,
    message: "Appointments are available during clinic hours.",
  },

  emergency: {
    available: true,
    message:
      "Emergency dental assistance is available during opening hours.",
  },
};

export default business;