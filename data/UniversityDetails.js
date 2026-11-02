const UniversityDetails = {
  // --- Existing Universities (with fixes) ---
  umt: {
    id: 1,
    name: "University of Management and Technology",
    shortName: "UMT",
    domain: "umt.edu.pk",
    website: "https://www.umt.edu.pk",
    logo: "/src/assets/UMT.png",
    established: 1990,
    type: "Private",
    location: "Lahore, Punjab",
    description:
      "UMT is a top private university in Pakistan offering programs in management, technology, and sciences.",
    contact: {
      phone: "042-111-868-868",
      email: "admissions@umt.edu.pk",
      address: "C-II, Johar Town, Lahore 54770, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-42-35212801 Ext: 3412",
        email: "admissions@umt.edu.pk",
        website: "https://admissions.umt.edu.pk",
      },
      studentServices: {
        phone: "+92-42-35212801",
        email: "student.services@umt.edu.pk",
        website: "https://www.umt.edu.pk/Students",
      },
      helpDesk: {
        phone: "+92-42-111-868-868",
        email: "helpdesk@umt.edu.pk",
        website: "https://helpdesk.umt.edu.pk",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/UMT.edu.pk",
      twitter: "https://twitter.com/UMT_Lahore",
      linkedin: "https://www.linkedin.com/school/umt-lahore/",
      youtube: "https://www.youtube.com/user/UMTChannel",
    },
    quickLinks: [
      { name: "Student Portal", url: "https://online.umt.edu.pk" },
      { name: "LMS", url: "https://lms.umt.edu.pk" },
      { name: "Library", url: "https://library.umt.edu.pk" },
      {
        name: "Academic Calendar",
        url: "https://www.umt.edu.pk/org/Academic-Calendar.aspx",
      },
      { name: "Fee Structure", url: "https://admissions.umt.edu.pk/fee.aspx" },
      { name: "Faculty Directory", url: "https://www.umt.edu.pk/faculty.aspx" },
    ],
    emergencyContact: {
      security: "+92-42-35212801",
      medical: " 042 111-868-862",
      transport: " +92 42 5212801-10",
    },
  },

  // --- New Universities (already provided in your snippet) ---
  aku: {
    id: 17,
    name: "Aga Khan University",
    shortName: "AKU",
    domain: "aku.edu",
    website: "https://www.aku.edu",
    logo: "/src/assets/AKU.png",
    established: 1983,
    type: "Private",
    location: "Karachi, Sindh",
    description:
      "Aga Khan University is an international university with a strong focus on health sciences, education, and research.",
    contact: {
      phone: "+92-21-3493-0051",
      email: "admissions.query@aku.edu",
      address: "Stadium Road, P.O. Box 3500, Karachi 74800, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-21-3486-4410",
        email: "admissions.query@aku.edu",
        website: "https://www.aku.edu/admissions",
      },
      studentServices: {
        phone: "+92-21-3493-0051",
        email: "student.affairs@aku.edu",
        website: "https://www.aku.edu/students/Pages/home.aspx",
      },
      helpDesk: {
        phone: "+92-21-3493-0051",
        email: "communications@aku.edu",
        website: "https://www.aku.edu/Pages/contact.aspx",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/agakhanuniversity",
      twitter: "https://twitter.com/AKUGlobal",
      linkedin: "https://www.linkedin.com/school/aga-khan-university/",
      youtube: "https://www.youtube.com/user/agakhanuniversity",
    },
    quickLinks: [
      { name: "Library", url: "https://ecommons.aku.edu" },
      { name: "Research", url: "https://www.aku.edu/research" },
      { name: "Careers", url: "https://www.aku.edu/careers" },
    ],
    emergencyContact: {
      security: "+92 3486 1900",
      medical: "+92 21 3486 1090",
      transport: "+92-21-3493-0051",
    },
  },

  bahria: {
    id: 18,
    name: "Bahria University",
    shortName: "BU",
    domain: "bahria.edu.pk",
    website: "https://www.bahria.edu.pk",
    logo: "/src/assets/BU.png",
    established: 2000,
    type: "Public (Semi-Government, Pakistan Navy)",
    location: "Islamabad, with campuses in Karachi & Lahore",
    description:
      "Bahria University is a federally chartered public university established by Pakistan Navy, offering programs in science, engineering, and management.",
    contact: {
      phone: "+92-51-9260002",
      email: "info@bahria.edu.pk",
      address: "Shangrilla Road, Sector E-8, Islamabad, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-51-9260002",
        email: "admissions@bahria.edu.pk",
        website: "https://www.bahria.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-9260002",
        email: "studentaffairs@bahria.edu.pk",
        website: "https://www.bahria.edu.pk/student-services",
      },
      helpDesk: {
        phone: "+92-51-9260002",
        email: "helpdesk@bahria.edu.pk",
        website: "https://www.bahria.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/BahriaUniversityOfficial",
      twitter: "https://twitter.com/OfficialBahriaU",
      linkedin: "https://www.linkedin.com/school/bahria-university/",
      youtube: "https://www.youtube.com/c/BahriaUniversityOfficial",
    },
    quickLinks: [
      { name: "Library", url: "https://library.bahria.edu.pk" },
      { name: "Research", url: "https://www.bahria.edu.pk/research" },
      { name: "Careers", url: "https://www.bahria.edu.pk/jobs" },
    ],
    emergencyContact: {
      security: "+92-51-9260002",
      medical: "+92-51-9260002",
      transport: "+92-51-9260002",
    },
  },

  air: {
    id: 19,
    name: "Air University",
    shortName: "AU",
    domain: "au.edu.pk",
    website: "https://www.au.edu.pk",
    logo: "/src/assets/AU.png",
    established: 2002,
    type: "Public (Pakistan Air Force)",
    location: "Islamabad, Pakistan",
    description:
      "Air University is a public university established by the Pakistan Air Force, offering programs in engineering, IT, business, and health sciences.",
    contact: {
      phone: "+92-51-9262557",
      email: "info@au.edu.pk",
      address: "E-9, Islamabad, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-51-9262557",
        email: "admissions@au.edu.pk",
        website: "https://www.au.edu.pk/pages/Admissions.aspx",
      },
      studentServices: {
        phone: "+92-51-9262557",
        email: "student.affairs@au.edu.pk",
        website: "https://www.au.edu.pk/pages/StudentServices.aspx",
      },
      helpDesk: {
        phone: "+92-51-9262557",
        email: "helpdesk@au.edu.pk",
        website: "https://www.au.edu.pk/pages/ContactUs.aspx",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/airuniversityofficial",
      twitter: "https://twitter.com/AirUniversity_",
      linkedin: "https://www.linkedin.com/school/air-university-pakistan/",
      youtube: "https://www.youtube.com/c/AirUniversityOfficial",
    },
    quickLinks: [
      { name: "LMS", url: "https://lms.au.edu.pk" },
      { name: "Library", url: "https://library.au.edu.pk" },
      { name: "Research", url: "https://www.au.edu.pk/pages/Research.aspx" },
    ],
    emergencyContact: {
      security: "+92-51-9262557",
      medical: "+92-51-9262557",
      transport: "+92-51-9262557",
    },
  },

  ist: {
    id: 20,
    name: "Institute of Space Technology",
    shortName: "IST",
    domain: "ist.edu.pk",
    website: "https://www.ist.edu.pk",
    logo: "/src/assets/IST.png",
    established: 2002,
    type: "Public",
    location: "Islamabad, Pakistan",
    description:
      "IST is a public university specializing in space science, aerospace engineering, and related fields.",
    contact: {
      phone: "+92-51-9075100",
      email: "info@ist.edu.pk",
      address: "Islamabad Highway, Near Rawat Toll Plaza, Islamabad, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-51-9075100",
        email: "admissions@ist.edu.pk",
        website: "https://www.ist.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-9075100",
        email: "student.affairs@ist.edu.pk",
        website: "https://www.ist.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-51-9075100",
        email: "helpdesk@ist.edu.pk",
        website: "https://www.ist.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/ISTofficial",
      twitter: "https://twitter.com/IST_Official",
      linkedin:
        "https://www.linkedin.com/school/institute-of-space-technology/",
      youtube: "https://www.youtube.com/c/ISTOfficial",
    },
    quickLinks: [
      { name: "Library", url: "https://library.ist.edu.pk" },
      { name: "Research", url: "https://www.ist.edu.pk/research" },
      { name: "Careers", url: "https://www.ist.edu.pk/careers" },
    ],
    emergencyContact: {
      security: "+92-51-9075100",
      medical: "+92-51-9075100",
      transport: "+92-51-9075100",
    },
  },

  // --- Previously added by assistant: LUMS and NUST ---
  lums: {
    id: 21,
    name: "Lahore University of Management Sciences",
    shortName: "LUMS",
    domain: "lums.edu.pk",
    website: "https://www.lums.edu.pk",
    logo: "/src/assets/LUMS.png",
    established: 1985,
    type: "Private",
    location: "Lahore, Punjab",
    description:
      "LUMS is a private research university in Lahore known for its strong programs in business, law, science & engineering, humanities, and education.",
    contact: {
      phone: "+92-42-3560-8000",
      email: "info@lums.edu.pk",
      address: "DHA, Lahore Cantt. 54792, Lahore, Punjab, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-42-3560-8000 Ext: 2177",
        email: "admissions@lums.edu.pk",
        website: "https://admission.lums.edu.pk",
      },
      studentServices: {
        phone: "+92-42-3560-8000",
        email: "student.affairs@lums.edu.pk",
        website: "https://www.lums.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-42-3560-8000",
        email: "helpdesk@lums.edu.pk",
        website: "https://www.lums.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/LUMS.edu.pk",
      twitter: "https://twitter.com/LUMSofficial",
      linkedin: "https://www.linkedin.com/school/lums/",
      youtube: "https://www.youtube.com/c/LUMSOfficial",
    },
    quickLinks: [
      { name: "Student Portal", url: "https://portal.lums.edu.pk" },
      { name: "Library", url: "https://library.lums.edu.pk" },
      { name: "Programmes", url: "https://lums.edu.pk/academics/programmes" },
      { name: "Admissions", url: "https://admission.lums.edu.pk" },
      { name: "Help Desk", url: "https://www.lums.edu.pk/contact-us" },
    ],
    emergencyContact: {
      security: "+92-42-3560-8877",
      medical: "+92-42-3560-8500",
      transport: "+92-42-3560-8877",
    },
  },

  nust: {
    id: 22,
    name: "National University of Sciences & Technology",
    shortName: "NUST",
    domain: "nust.edu.pk",
    website: "https://www.nust.edu.pk",
    logo: "/src/assets/NUST.png",
    established: 1991,
    type: "Public",
    location: "Islamabad, Pakistan",
    description:
      "NUST is a public research university with its main campus in Islamabad, offering programs in engineering, sciences, business, IT, arts, and humanities.",
    contact: {
      phone: "+92-51-111-11-6878",
      email: "info@nust.edu.pk",
      address: "NUST Campus, Sector H-12, Islamabad, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-51-90856878",
        email: "netadmissions@nust.edu.pk",
        website: "https://nust.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-90851099",
        email: "studenthelpdesk@nust.edu.pk",
        website: "https://campuslife.nust.edu.pk",
      },
      helpDesk: {
        phone: "+92-51-111-11-6878",
        email: "helpdesk@nust.edu.pk",
        website: "https://nust.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/NUSTOfficial",
      twitter: "https://twitter.com/NUSTofficial",
      linkedin: "https://www.linkedin.com/school/nust/",
      youtube: "https://www.youtube.com/c/NUSTOfficial",
    },
    quickLinks: [
      { name: "Undergraduate Admissions", url: "https://nust.edu.pk/admissions/undergraduates" },
      { name: "Research & Innovation", url: "https://www.nust.edu.pk/research-innovation" },
      { name: "Library", url: "https://library.nust.edu.pk" },
      { name: "Academic Calendar", url: "https://nust.edu.pk/resources/academic-calendar" },
      { name: "Help Desk", url: "https://campuslife.nust.edu.pk/contact" },
    ],
    emergencyContact: {
      security: "+92-51-90851111",
      medical: "+92-51-90851300",
      transport: "+92-51-90851111",
    },
  },

  // --- Additional 13 universities added below (ids 23 -> 35) ---
  uet: {
    id: 23,
    name: "University of Engineering and Technology, Lahore",
    shortName: "UET Lahore",
    domain: "uet.edu.pk",
    website: "https://www.uet.edu.pk",
    logo: "/src/assets/UET.png",
    established: 1921,
    type: "Public",
    location: "Lahore, Punjab",
    description:
      "UET Lahore is one of Pakistan's oldest and most prominent engineering universities, known for civil, mechanical, electrical and computer engineering programs.",
    contact: {
      phone: "+92-42-99029205",
      email: "vc@uet.edu.pk",
      address: "G.T. Road, Lahore Cantt, Lahore 54890, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-42-99029216",
        email: "admissions@uet.edu.pk",
        website: "https://uet.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-42-99029205",
        email: "student.affairs@uet.edu.pk",
        website: "https://uet.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-42-99029205",
        email: "info@uet.edu.pk",
        website: "https://uet.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/UETLahorePak",
      twitter: "https://twitter.com/UETLahore",
      linkedin: "https://www.linkedin.com/school/uet-lahore/",
      youtube: "https://www.youtube.com/c/UETLahore",
    },
    quickLinks: [
      { name: "Admissions", url: "https://uet.edu.pk/admissions" },
      { name: "Departments", url: "https://uet.edu.pk/departments" },
      { name: "Library", url: "https://uet.edu.pk/library" },
      { name: "Contacts", url: "https://uet.edu.pk/contact-us" },
    ],
    emergencyContact: {
      security: "+92-42-99029205",
      medical: "+92-42-99029205",
      transport: "+92-42-99029205",
    },
  },

  pu: {
    id: 24,
    name: "University of the Punjab",
    shortName: "PU",
    domain: "pu.edu.pk",
    website: "https://www.pu.edu.pk",
    logo: "/src/assets/PU.png",
    established: 1882,
    type: "Public",
    location: "Lahore, Punjab",
    description:
      "The University of the Punjab (PU) is Pakistan's oldest and one of the largest public universities, offering a wide range of programs across disciplines.",
    contact: {
      phone: "+92-42-99231099",
      email: "vc@pu.edu.pk",
      address: "Quaid-e-Azam Campus, Lahore, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-42-99231102",
        email: "registrar@pu.edu.pk",
        website: "https://pu.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-42-99231102",
        email: "student.affairs@pu.edu.pk",
        website: "https://pu.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-42-99231099",
        email: "info@pu.edu.pk",
        website: "https://pu.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/universityofthepunjab",
      twitter: "https://twitter.com/universityofpunj",
      linkedin: "https://www.linkedin.com/school/university-of-the-punjab/",
      youtube: "https://www.youtube.com/c/UniversityOfThePunjab",
    },
    quickLinks: [
      { name: "Admissions", url: "https://pu.edu.pk/admissions" },
      { name: "Campuses", url: "https://pu.edu.pk/campuses" },
      { name: "Academic Calendar", url: "https://pu.edu.pk/academiccalendar" },
    ],
    emergencyContact: {
      security: "+92-42-99231111",
      medical: "+92-42-99231112",
      transport: "+92-42-99231113",
    },
  },

  comsats: {
    id: 25,
    name: "COMSATS University Islamabad",
    shortName: "COMSATS",
    domain: "comsats.edu.pk",
    website: "https://www.comsats.edu.pk",
    logo: "/src/assets/COMSATS.png",
    established: 1998,
    type: "Public",
    location: "Islamabad (multiple campuses across Pakistan)",
    description:
      "COMSATS is a multi-campus public research university with strong programs in engineering, IT, and sciences.",
    contact: {
      phone: "+92-51-9247000",
      email: "admissions@comsats.edu.pk",
      address: "Park Road, Tarlai Kalan, Islamabad 45550, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-51-9247000",
        email: "admissions@comsats.edu.pk",
        website: "https://www.comsats.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-9247002",
        email: "studentaffairs@comsats.edu.pk",
        website: "https://www.comsats.edu.pk/student-services",
      },
      helpDesk: {
        phone: "+92-51-9247000",
        email: "info@comsats.edu.pk",
        website: "https://www.comsats.edu.pk/contactus.aspx",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/COMSATSUniversity",
      twitter: "https://twitter.com/COMSATS",
      linkedin: "https://www.linkedin.com/school/comsats-university/",
      youtube: "https://www.youtube.com/c/COMSATSUniversity",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.comsats.edu.pk/admissions" },
      { name: "Campuses", url: "https://www.comsats.edu.pk/campuses" },
      { name: "Research", url: "https://www.comsats.edu.pk/research" },
    ],
    emergencyContact: {
      security: "+92-51-9247000",
      medical: "+92-51-9247000",
      transport: "+92-51-9247000",
    },
  },

  fast: {
    id: 26,
    name: "FAST National University of Computer and Emerging Sciences",
    shortName: "FAST-NUCES",
    domain: "nu.edu.pk",
    website: "https://www.nu.edu.pk",
    logo: "/src/assets/FAST.png",
    established: 2000,
    type: "Private",
    location: "Multiple campuses (Islamabad, Lahore, Karachi, Peshawar)",
    description:
      "FAST-NUCES (commonly called FAST) is a leading private university focusing on computer science, engineering and IT education across Pakistan.",
    contact: {
      phone: "111-128-128",
      email: "info@nu.edu.pk",
      address: "FAST-House, Rohtas Road, G-9/4, Islamabad 44000, Pakistan",
    },
    support: {
      admissions: {
        phone: "111-128-128",
        email: "intoﬃce@nu.edu.pk",
        website: "https://www.nu.edu.pk/admissions",
      },
      studentServices: {
        phone: "111-128-128",
        email: "studentaffairs@nu.edu.pk",
        website: "https://www.nu.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "111-128-128",
        email: "support@nu.edu.pk",
        website: "https://www.nu.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/FAST.NUCES",
      twitter: "https://twitter.com/FAST_NUCES",
      linkedin: "https://www.linkedin.com/school/fast-nuces/",
      youtube: "https://www.youtube.com/c/FASTNUCES",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.nu.edu.pk/admissions" },
      { name: "Campuses", url: "https://www.nu.edu.pk/campuses" },
      { name: "LMS", url: "https://lms.nu.edu.pk" },
    ],
    emergencyContact: {
      security: "111-128-128",
      medical: "111-128-128",
      transport: "111-128-128",
    },
  },

  qau: {
    id: 27,
    name: "Quaid-i-Azam University",
    shortName: "QAU",
    domain: "qau.edu.pk",
    website: "https://www.qau.edu.pk",
    logo: "/src/assets/QAU.png",
    established: 1967,
    type: "Public",
    location: "Islamabad, Pakistan",
    description:
      "Quaid-i-Azam University is a leading public research university in Islamabad known for natural sciences and social sciences.",
    contact: {
      phone: "+92-51-9064-4068",
      email: "info@qau.edu.pk",
      address: "Quaid-i-Azam University, Islamabad 45320, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-51-9064-4062",
        email: "admissions@qau.edu.pk",
        website: "https://qau.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-9064-3028",
        email: "oisa@qau.edu.pk",
        website: "https://qau.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-51-9064-0000",
        email: "info@qau.edu.pk",
        website: "https://qau.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/qaupk",
      twitter: "https://twitter.com/qau_pak",
      linkedin: "https://www.linkedin.com/school/quaid-i-azam-university/",
      youtube: "https://www.youtube.com/c/QuaidIAzamUniversity",
    },
    quickLinks: [
      { name: "Admissions", url: "https://qau.edu.pk/admissions" },
      { name: "Departments", url: "https://qau.edu.pk/department" },
      { name: "Contact", url: "https://qau.edu.pk/contact-us" },
    ],
    emergencyContact: {
      security: "+92-51-90640000",
      medical: "+92-51-90640000",
      transport: "+92-51-90640000",
    },
  },

  uok: {
    id: 28,
    name: "University of Karachi",
    shortName: "UoK",
    domain: "uok.edu.pk",
    website: "https://www.uok.edu.pk",
    logo: "/src/assets/UOK.png",
    established: 1951,
    type: "Public",
    location: "Karachi, Sindh",
    description:
      "University of Karachi (UoK) is one of Pakistan's largest universities, offering a wide range of undergraduate and postgraduate programs.",
    contact: {
      phone: "+92-21-99261300",
      email: "vc@uok.edu.pk",
      address: "University Road, Karachi 75270, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-21-99261300",
        email: "admissions@uok.edu.pk",
        website: "https://www.uok.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-21-99261300",
        email: "studentaffairs@uok.edu.pk",
        website: "https://www.uok.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-21-99261300",
        email: "info@uok.edu.pk",
        website: "https://www.uok.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/universityofkarachi",
      twitter: "https://twitter.com/uok_official",
      linkedin: "https://www.linkedin.com/school/university-of-karachi/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.uok.edu.pk/admissions" },
      { name: "Departments", url: "https://www.uok.edu.pk/academics" },
      { name: "Contact", url: "https://www.uok.edu.pk/contacts.php" },
    ],
    emergencyContact: {
      security: "+92-21-99261300",
      medical: "+92-21-99261300",
      transport: "+92-21-99261300",
    },
  },

  gcu: {
    id: 29,
    name: "Government College University, Lahore",
    shortName: "GCU Lahore",
    domain: "gcu.edu.pk",
    website: "https://gcu.edu.pk",
    logo: "/src/assets/GCU.png",
    established: 1864,
    type: "Public",
    location: "Lahore, Punjab",
    description:
      "GCU Lahore is a historic public university renowned for arts, sciences and research with a long legacy.",
    contact: {
      phone: "+92-42-99213340",
      email: "registrar@gcu.edu.pk",
      address: "Katchery Road, Lahore 54000, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-42-99213340",
        email: "admissions@gcu.edu.pk",
        website: "https://gcu.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-42-99213340",
        email: "student.affairs@gcu.edu.pk",
        website: "https://gcu.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-42-99213340",
        email: "info@gcu.edu.pk",
        website: "https://gcu.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/GCUniversityLahore",
      twitter: "https://twitter.com/gculahore",
      linkedin: "https://www.linkedin.com/school/gc-university-lahore/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://gcu.edu.pk/admission" },
      { name: "Departments", url: "https://gcu.edu.pk/departments" },
      { name: "Contact", url: "https://gcu.edu.pk/about.php?pg=ContactUs" },
    ],
    emergencyContact: {
      security: "+92-42-99213340",
      medical: "+92-42-99213340",
      transport: "+92-42-99213340",
    },
  },

  aiou: {
    id: 30,
    name: "Allama Iqbal Open University",
    shortName: "AIOU",
    domain: "aiou.edu.pk",
    website: "https://www.aiou.edu.pk",
    logo: "/src/assets/AIOU.png",
    established: 1974,
    type: "Public (Open University)",
    location: "Islamabad, Pakistan",
    description:
      "AIOU is Pakistan's premier open university offering distance learning programs nationwide.",
    contact: {
      phone: "051-111-112-468",
      email: "support@aiou.edu.pk",
      address: "Sector H-8, Islamabad 44000, Pakistan",
    },
    support: {
      admissions: {
        phone: "051-111-112-468",
        email: "admissions@aiou.edu.pk",
        website: "https://www.aiou.edu.pk/Admission",
      },
      studentServices: {
        phone: "051-111-112-468",
        email: "student.affairs@aiou.edu.pk",
        website: "https://www.aiou.edu.pk/student-services",
      },
      helpDesk: {
        phone: "051-111-112-468",
        email: "support@aiou.edu.pk",
        website: "https://support.aiou.edu.pk",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/aioupakistan",
      twitter: "https://twitter.com/aiou",
      linkedin: "https://www.linkedin.com/school/aiou/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.aiou.edu.pk/Admission" },
      { name: "Student Portal", url: "https://online.aiou.edu.pk" },
      { name: "Support", url: "https://support.aiou.edu.pk" },
    ],
    emergencyContact: {
      security: "051-111-112-468",
      medical: "051-111-112-468",
      transport: "051-111-112-468",
    },
  },

  iiui: {
    id: 31,
    name: "International Islamic University, Islamabad",
    shortName: "IIUI",
    domain: "iiu.edu.pk",
    website: "https://www.iiu.edu.pk",
    logo: "/src/assets/IIUI.png",
    established: 1980,
    type: "Public",
    location: "Islamabad, Pakistan",
    description:
      "IIUI is a public university integrating Islamic learning with modern disciplines across multiple campuses.",
    contact: {
      phone: "051-111-448-448",
      email: "info@iiui.edu.pk",
      address: "H-10, Islamabad, Pakistan",
    },
    support: {
      admissions: {
        phone: "051-111-448-448",
        email: "admissions@iiui.edu.pk",
        website: "https://www.iiu.edu.pk/admissions",
      },
      studentServices: {
        phone: "051-448-6422",
        email: "student.affairs@iiui.edu.pk",
        website: "https://www.iiu.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "051-448-6423",
        email: "info@iiui.edu.pk",
        website: "https://www.iiu.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/iiuofficial",
      twitter: "https://twitter.com/iiu_official",
      linkedin: "https://www.linkedin.com/school/iiu/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.iiu.edu.pk/admissions" },
      { name: "Departments", url: "https://www.iiu.edu.pk/departments" },
      { name: "Contact", url: "https://www.iiu.edu.pk/contact-us" },
    ],
    emergencyContact: {
      security: "051-448-6424",
      medical: "051-448-6425",
      transport: "051-448-6422",
    },
  },

  iba: {
    id: 32,
    name: "Institute of Business Administration, Karachi",
    shortName: "IBA Karachi",
    domain: "iba.edu.pk",
    website: "https://www.iba.edu.pk",
    logo: "/src/assets/IBA.png",
    established: 1955,
    type: "Public (Autonomous)",
    location: "Karachi, Sindh",
    description:
      "IBA Karachi is one of Pakistan's top business schools offering strong programs in business, economics and data sciences.",
    contact: {
      phone: "+92-21-38104700",
      email: "info@iba.edu.pk",
      address: "University Road, Karachi 75270, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-21-38104700",
        email: "admissions@iba.edu.pk",
        website: "https://www.iba.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-21-38104700 Ext: 3005",
        email: "osa@iba.edu.pk",
        website: "https://osa.iba.edu.pk",
      },
      helpDesk: {
        phone: "+92-21-38104700",
        email: "info@iba.edu.pk",
        website: "https://www.iba.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/IBAKarachi",
      twitter: "https://twitter.com/iba_karachi",
      linkedin: "https://www.linkedin.com/school/iba-karachi/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.iba.edu.pk/admissions" },
      { name: "Programs", url: "https://www.iba.edu.pk/programs" },
      { name: "Contact", url: "https://www.iba.edu.pk/iba-phone-directory.php" },
    ],
    emergencyContact: {
      security: "+92-21-38104700",
      medical: "+92-21-38104700",
      transport: "+92-21-38104700",
    },
  },

  muet: {
    id: 33,
    name: "Mehran University of Engineering & Technology",
    shortName: "MUET",
    domain: "muet.edu.pk",
    website: "https://www.muet.edu.pk",
    logo: "/src/assets/MUET.png",
    established: 1963,
    type: "Public",
    location: "Jamshoro, Sindh",
    description:
      "MUET is a leading engineering university in Sindh with strengths in engineering, technology and applied sciences.",
    contact: {
      phone: "+92-22-2771197",
      email: "info@muet.edu.pk",
      address: "Indus Highway, Jamshoro 76062, Sindh, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-22-2771197",
        email: "admission@muet.edu.pk",
        website: "https://www.muet.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-22-2772251",
        email: "asa@admin.muet.edu.pk",
        website: "https://www.muet.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-22-2771197",
        email: "info@muet.edu.pk",
        website: "https://www.muet.edu.pk/contact",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/MUETOfficial",
      twitter: "https://twitter.com/muet_jamshoro",
      linkedin: "https://www.linkedin.com/school/muet-jamshoro/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.muet.edu.pk/admissions" },
      { name: "Departments", url: "https://www.muet.edu.pk/departments" },
      { name: "Contact", url: "https://site.muet.edu.pk/directorates/centre-english-language-linguistics/contact-us" },
    ],
    emergencyContact: {
      security: "+92-22-2771197",
      medical: "+92-22-2771197",
      transport: "+92-22-2771197",
    },
  },

  uaf: {
    id: 34,
    name: "University of Agriculture, Faisalabad",
    shortName: "UAF",
    domain: "uaf.edu.pk",
    website: "https://www.uaf.edu.pk",
    logo: "/src/assets/UAF.png",
    established: 1906,
    type: "Public",
    location: "Faisalabad, Punjab",
    description:
      "UAF is a leading agricultural university in Pakistan offering programs in agriculture, food sciences and related fields.",
    contact: {
      phone: "+92-41-9200161",
      email: "registrar@uaf.edu.pk",
      address: "Agriculture University Road, Faisalabad 38000, Pakistan",
    },
    support: {
      admissions: {
        phone: "+92-41-9200161",
        email: "admissions@uaf.edu.pk",
        website: "https://www.uaf.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-41-9200161",
        email: "student.affairs@uaf.edu.pk",
        website: "https://www.uaf.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-41-9200161",
        email: "info@uaf.edu.pk",
        website: "https://www.uaf.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/UAFOfficial",
      twitter: "https://twitter.com/uaf_fsd",
      linkedin: "https://www.linkedin.com/school/university-of-agriculture-faisalabad/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://www.uaf.edu.pk/admissions" },
      { name: "Departments", url: "https://www.uaf.edu.pk/departments" },
      { name: "Contact", url: "https://www.uaf.edu.pk/contact-us" },
    ],
    emergencyContact: {
      security: "+92-41-9200161",
      medical: "+92-41-9200161",
      transport: "+92-41-9200161",
    },
  },

  szabist: {
    id: 35,
    name: "Shaheed Zulfikar Ali Bhutto Institute of Science & Technology",
    shortName: "SZABIST",
    domain: "szabist.edu.pk",
    website: "https://www.szabist.edu.pk",
    logo: "/src/assets/SZABIST.png",
    established: 1995,
    type: "Private",
    location: "Karachi (multiple campuses in Pakistan & Dubai)",
    description:
      "SZABIST is a private institute offering programs in IT, business, social sciences and media across several campuses.",
    contact: {
      phone: "+92-21-3582-1535",
      email: "info@szabist.edu.pk",
      address: "153, Zamzama Commercial Lane, Karachi, Pakistan",
    },
    support: {
      admissions: {
        phone: "111-922-478",
        email: "admissions@szabist.edu.pk",
        website: "https://admissions.szabist.edu.pk",
      },
      studentServices: {
        phone: "+92-21-3582-1535",
        email: "student.affairs@szabist.edu.pk",
        website: "https://www.szabist.edu.pk/student-services",
      },
      helpDesk: {
        phone: "+92-21-3582-1535",
        email: "info@szabist.edu.pk",
        website: "https://www.szabist.edu.pk/contact-us",
      },
    },
    socialMedia: {
      facebook: "https://www.facebook.com/SZABIST",
      twitter: "https://twitter.com/szabist",
      linkedin: "https://www.linkedin.com/school/szabist/",
    },
    quickLinks: [
      { name: "Admissions", url: "https://admissions.szabist.edu.pk" },
      { name: "Campuses", url: "https://www.szabist.edu.pk/campuses" },
      { name: "Contact", url: "https://www.szabist.edu.pk/contact-us" },
    ],
    emergencyContact: {
      security: "+92-21-3582-1535",
      medical: "+92-21-3582-1535",
      transport: "+92-21-3582-1535",
    },
  },
};

export default UniversityDetails;
