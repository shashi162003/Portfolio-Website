const config = {
    apiUrl: import.meta.env.PROD
        ? 'https://blog-backend.onrender.com' // Production URL (you'll need to update this with your actual Render URL)
        : 'http://localhost:5000' // Development URL
};

export default config; 