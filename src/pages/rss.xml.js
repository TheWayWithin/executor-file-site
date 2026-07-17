import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_NAME } from '../config';

export async function GET(context) {
  const articles = (await getCollection('learn', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: `${SITE_NAME}: Learn`,
    description:
      'Practical writing on digital estates: finding accounts, what your executor will actually face, and how to leave less detective work behind.',
    site: context.site,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: `/learn/${a.id}`,
    })),
  });
}
