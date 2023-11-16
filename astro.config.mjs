import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.MODE === 'development' ? 'http://localhost:4321' : 'https://wierszemalwiny.pl',
	integrations: [mdx(), sitemap()],
});
