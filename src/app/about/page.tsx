import BentoCards from '@/components/about/bento-card'
import InteractiveSelector from '@/components/about/gallery-wrapper'
import { AboutHero } from '@/components/about/hero'
import { CompanyStory } from '@/components/about/company-story'
import { BoardOfDirectors } from '@/components/about/board-of-directors'

export const metadata = {
    title: 'About - Plaza Sales',
    description: 'Discover the story behind Plaza Sales Pvt. Ltd. – Nepal\'s most dynamic IT solutions provider since 2014! We\'re passionate innovators committed to empowering businesses with cutting-edge technology, exceptional service, and solutions that truly make a difference.',
    keywords: ['About Us', 'Plaza Sales', 'Company Information', 'Our Mission', 'Our Vision', 'Customer Service', 'Electronics Retailer', 'IT Solutions Nepal'],
}


export default function AboutPage() {
    return (
        <div className="w-full  mx-auto space-y-6 lg:space-y-12">
            <div className="space-y-0">
                <div className="h-fit w-full overflow-hidden">
                    <AboutHero />
                </div>
                <CompanyStory />
            </div>

            <BoardOfDirectors />
            <BentoCards />
            <InteractiveSelector />
        </div>
    )
}
