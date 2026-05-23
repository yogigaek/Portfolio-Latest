import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'

const ProjectDetail = lazy(() => import('@/components/pages/ProjectDetail'))

function PageLoader() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <p className="text-text-muted text-sm">Loading...</p>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<MainLayout />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/detail" element={<Navigate to="/projects/mern-ecommerce" replace />} />
                    <Route path="/detail2" element={<Navigate to="/projects/php-ecommerce" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
            <div>
                <p className="text-8xl font-display font-bold gradient-text-accent mb-4">404</p>
                <h1 className="text-2xl font-display font-bold text-text-primary mb-3">Page Not Found</h1>
                <p className="text-text-secondary mb-8">The page you're looking for doesn't exist.</p>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-200"
                >
                    Back to Portfolio
                </a>
            </div>
        </div>
    )
}
