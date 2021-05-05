import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import components from '../features/mdx-components';
import getData from './get-data';

const getPageData = (slug) => {
  // try {
    const page = getData(`pages/${slug}`);

    console.log(`fetching page ${slug}`);
    console.log(page);
    page.content = renderToString(page.content, {
      components,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
      },
    });
    return { page };
  // } catch (error) {
  //   console.log('-------------------')
  //   console.log('Page Rendering error')
  //   console.log(error)
  //   return undefined;
  // }
};

export default getPageData;
