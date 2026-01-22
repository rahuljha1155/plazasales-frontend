export const metadata = {
  title: 'Shareable Resources - Plaza Sales',
  description: 'Explore our collection of shareable resources including blogs, career opportunities, and more from Plaza Sales Pvt. Ltd.',
  keywords: ['Resources', 'Blogs', 'Career', 'Plaza Sales', 'IT Solutions Nepal'],
}

export default function ShareableResourcesPage() {
  return (
    <div className="w-full mx-auto space-y-6 lg:space-y-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-12">
        <h1 className="text-4xl font-bold mb-6">Shareable Resources</h1>
        <p className="text-muted-foreground mb-8">
          Explore our collection of resources, insights, and opportunities.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3">Blogs</h2>
            <p className="text-muted-foreground mb-4">
              Read our latest articles, insights, and updates about technology and industry trends.
            </p>
            <a href="/blogs" className="text-primary hover:underline">
              Explore Blogs →
            </a>
          </div>
          
          <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3">Career</h2>
            <p className="text-muted-foreground mb-4">
              Join our team and be part of Nepal's leading IT solutions provider.
            </p>
            <a href="/career" className="text-primary hover:underline">
              View Opportunities →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}