import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

export async function updateSeoFiles(sitemapUrl?: string, manifestUrl?: string) {
    const publicDir = path.join(process.cwd(), 'public');

    try {
        // Ensure public directory exists (though it should in a Next.js app)
        await fs.mkdir(publicDir, { recursive: true });

        if (sitemapUrl) {
            try {
                const response = await axios.get(sitemapUrl);
                const sitemapPath = path.join(publicDir, 'sitemap.xml');

                // Only write if content is different or file doesn't exist
                let existingContent = '';
                try {
                    existingContent = await fs.readFile(sitemapPath, 'utf-8');
                } catch {
                    // File doesn't exist, that's fine
                }

                if (response.data && response.data !== existingContent) {
                    await fs.writeFile(sitemapPath, response.data);
                }
            } catch {
            }
        }

        if (manifestUrl) {
            try {
                const response = await axios.get(manifestUrl);
                const manifestPath = path.join(publicDir, 'manifest.json');

                // Stringify if it's an object, otherwise use as is
                const manifestContent = typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data;

                let existingContent = '';
                try {
                    existingContent = await fs.readFile(manifestPath, 'utf-8');
                } catch {
                    // File doesn't exist
                }

                if (manifestContent && manifestContent !== existingContent) {
                    await fs.writeFile(manifestPath, manifestContent);
                }
            } catch {
            }
        }
    } catch {
    }
}
