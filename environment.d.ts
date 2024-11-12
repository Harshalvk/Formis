declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      GROQ_API_KEY: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      DATABASE_URL: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
