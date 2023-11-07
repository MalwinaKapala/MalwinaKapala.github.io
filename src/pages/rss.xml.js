import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const wiersze = (await getCollection('wiersze')).map((post) => ({...post, subpath: `/wiersze/`}));
	const dlamamyidziecka = (await getCollection('dlamamyidziecka')).map((post) => ({...post, subpath: `/dla-mamy-i-dziecka/`}));
	const ptaki = (await getCollection('ptaki')).map((post) => ({...post, subpath: `/ptaki/`}))
	const posts = [...wiersze, ...dlamamyidziecka, ...ptaki];
	return rss({
		xmlns: {'googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
			    'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
				'atom': 'http://www.w3.org/2005/Atom',
				'rawvoice': 'http://www.rawvoice.com/rawvoiceRssModule/',
				'content': 'http://purl.org/rss/1.0/modules/content/'},
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => {
			const item = {
				...post.data,
				link: `${post.subpath}/${post.slug}/`,
			};
			if (post.data.mp3 !== undefined) {
				item.enclosure = {
					url: `${context.site}${post.data.mp3}`,
					length: 120,
					type: 'mp3'
				};
			}
			return item;
		}),
		customData: `<googleplay:author>Malwina Kapała</googleplay:author>
		<rawvoice:rating>TV-G</rawvoice:rating>
		<rawvoice:location>Toruń, Poland</rawvoice:location>
		<rawvoice:frequency>Weekly</rawvoice:frequency>
		<author>Malwina Kapała</author>
		<itunes:author>Malwina Kapała</itunes:author>
		<itunes:email>example@example.com</itunes:email>
		<itunes:category text="Poetry" />
		<image>
		  <url>https://wierszemalwiny.pl/malwinaportret3.JPG</url>
		  <title>Wiersze Malwiny</title>
		  <link>https://wierszemalwiny.pl</link>
		</image>
		<itunes:owner>
		  <itunes:name>Malwina Kapała</itunes:name>
		  <itunes:email>example@example.com</itunes:email>
		</itunes:owner>
		<itunes:keywords>wiersze,mamy,dziecka,ptaki,poetry</itunes:keywords>
		<copyright>Malwina Kapała 2023</copyright>
		<description>Wiersze Malwiny</description>
		<googleplay:image href="https://wierszemalwiny.pl/malwinaportret3.JPG" />
		<language>pl-pl</language>
		<itunes:explicit>no</itunes:explicit>
		<pubDate>Mon, 6 Nov 2023 23:23:23 CEST</pubDate>
		<link>https://wierszemalwiny.pl/rss.xml</link>
		<itunes:image href="https://wierszemalwiny.pl/malwinaportret3.JPG" />
	`,
	});
}
