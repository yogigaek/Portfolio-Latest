import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import NotFound from '@/components/pages/NotFound'

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
        <MotionConfig reducedMotion="user">
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
        </MotionConfig>
    )
}
