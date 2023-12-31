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
			'podcast': "https://podcastindex.org/namespace/1.0",
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
                <podcast:locked>no</podcast:locked>
		<podcast:guid>23e11671-a570-5a96-88ca-6b1d22df6fdf</podcast:guid>
		<itunes:author>Malwina Kapała</itunes:author>
		<itunes:email>podcast@wierszemalwiny.pl</itunes:email>
		<itunes:category text="Kids &amp; Family">
  			<itunes:category text="Stories for Kids"/>
			<itunes:category text="Parenting"/>
			<itunes:category text="Pets &amp; Animals"/>
		</itunes:category>
		<image>
		  <url>${context.site}podcast-cover.jpg</url>
		  <title>Wiersze Malwiny</title>
		  <link>${context.site}</link>
		</image>
		<itunes:owner>
		  <itunes:name>Malwina Kapała</itunes:name>
		  <itunes:email>podcast@wierszemalwiny.pl</itunes:email>
		</itunes:owner>
		<itunes:keywords>wiersze,mamy,dziecka,ptaki,poetry</itunes:keywords>
		<copyright>Malwina Kapała 2023</copyright>
		<description>Wiersze Malwiny</description>
		<googleplay:image href="${context.site}podcast-cover.jpg" />
		<language>pl-pl</language>
		<itunes:explicit>no</itunes:explicit>
		<pubDate>Mon, 6 Nov 2023 23:23:23 CEST</pubDate>
		<link>${context.site}rss.xml</link>
		<itunes:image href="${context.site}podcast-cover.jpg" />
	`,
	});
}
