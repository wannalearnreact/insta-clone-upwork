/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            white: '#ffffff',
            blue: {
                medium: '#005c98',
            },
            black: {
                light: '#262626',
                faded: '#00000059',
            },
            gray: {
                base: '#616161',
                background: '#fafafa',
                primary: '#dbdbdb',
                border: '#e5e7eb',
            },
            red: {
                primary: '#ed4956',
            },
        },
        screens: {
            '2xl': { max: '1535px' },
            // => @media (max-width: 1535px) { ... }

            xl: { max: '1279px' },
            // => @media (max-width: 1279px) { ... }

            lg: { max: '1023px' },
            // => @media (max-width: 1023px) { ... }

            md: { max: '767px' },
            // => @media (max-width: 767px) { ... }

            sm: { max: '639px' },
            // => @media (max-width: 639px) { ... }
        },
        extend: {
            fontFamily: {
                Roboto: ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
