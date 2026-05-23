/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Swiper CSS side-effect imports
declare module 'swiper/css'
declare module 'swiper/css/pagination'
declare module 'swiper/css/autoplay'
declare module 'swiper/css/navigation'
