module.exports = {
  expo: {
    name: "JAW Restaurant",
    slug: "jaw-restaurant-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "jaw",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#5B4A8C"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.jaw.restaurant"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#5B4A8C"
      },
      package: "com.jaw.restaurant"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow JAW to access your photos for uploading restaurant and review images."
        }
      ]
    ]
  }
};