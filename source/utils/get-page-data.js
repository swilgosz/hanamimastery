import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import components from '../features/mdx-components';
import getData from './get-data';

const getPageData = async (slug) => {
  // try {
    const page =
        getData(`pages/${slug}*`)[0];

    page.content = await renderToString(page.content, {
      components,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
      },
    });
    return { page };
  // } catch (error) {
    // return undefined;
  // }
};

export default getPageData;
