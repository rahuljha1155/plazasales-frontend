import ShareableHero from "@/components/sharable/hero";
import ShareableBody from "@/components/sharable/body";
import { shareableService } from "@/services/shareableService";
import { IShareable } from "@/types/IShareable";

export const metadata = {
  title: 'Shareable Resources - Plaza Sales',
  description: 'Download brochures, manuals, catalogs, and datasheets for our products from Plaza Sales Pvt. Ltd.',
  keywords: ['Resources', 'Brochures', 'Manuals', 'Catalogs', 'Datasheets', 'Plaza Sales', 'IT Solutions Nepal'],
}

export default async function ShareableResourcesPage() {
  let shareables: IShareable[] = [];
  
  try {
    const response = await shareableService.getAllShareables(1, 100);
    shareables = response.data.shareables;
  } catch (error) {
    console.error("Failed to fetch shareables:", error);
  }

  return (
    <div className="w-full mx-auto">
      <ShareableHero />
      <ShareableBody shareables={shareables} />
    </div>
  );
}