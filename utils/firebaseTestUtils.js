// Test utility to verify Firebase storage structure
export const testFirebaseStorage = {
  // Expected Firestore document structure
  expectedItemSchema: {
    // Basic item information
    userId: "string",
    userEmail: "string",
    role: "lost | found",
    title: "string",
    description: "string",
    category: "string",
    location: "string",
    date: "YYYY-MM-DD",

    // Contact information
    contact: {
      email: "string",
      phone: "string",
      preference: "email | phone | both",
    },

    // University information
    university: {
      id: "number",
      name: "string",
      domain: "string",
      docId: "string",
    },

    // Media
    imageUrl: "string | null",

    // Metadata
    createdAt: "timestamp",
    updatedAt: "timestamp",
    status: "active | matched | resolved | deleted",

    // Search optimization
    titleLower: "string",
    categoryLower: "string",
    locationLower: "string",

    // Analytics
    views: "number",
    contactAttempts: "number",

    // Moderation
    isVerified: "boolean",
    flagCount: "number",
    isDeleted: "boolean",
  },

  // Test sample data
  sampleItemData: {
    userId: "test123",
    userEmail: "student@umt.edu.pk",
    role: "lost",
    title: "Black Wallet",
    description: "Lost my black leather wallet near library",
    category: "Wallet",
    location: "Library",
    date: "2025-09-13",
    contact: {
      email: "student@umt.edu.pk",
      phone: "+923001234567",
      preference: "both",
    },
    university: {
      id: 1,
      name: "University of Management & Technology (UMT)",
      domain: "umt.edu.pk",
      docId: "univ_umt",
    },
    imageUrl: null,
    status: "active",
    titleLower: "black wallet",
    categoryLower: "wallet",
    locationLower: "library",
    views: 0,
    contactAttempts: 0,
    isVerified: true,
    flagCount: 0,
    isDeleted: false,
  },

  // Validate item data structure
  validateItemData: (itemData) => {
    const errors = [];

    // Required fields validation
    const requiredFields = [
      "userId",
      "userEmail",
      "role",
      "title",
      "description",
      "category",
      "date",
      "contact",
      "university",
      "status",
    ];

    requiredFields.forEach((field) => {
      if (!(field in itemData)) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Type validations
    if (itemData.role && !["lost", "found"].includes(itemData.role)) {
      errors.push(`Invalid role: ${itemData.role}`);
    }

    if (itemData.contact && typeof itemData.contact !== "object") {
      errors.push("Contact must be an object");
    }

    if (itemData.university && typeof itemData.university !== "object") {
      errors.push("University must be an object");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Log successful submission for production use
  logSuccessfulSubmission: (docId) => {
    // Production logging would be handled by monitoring services
    // In production, you might want to send to analytics service
    return { docId, timestamp: Date.now() };
  },
};

export default testFirebaseStorage;
