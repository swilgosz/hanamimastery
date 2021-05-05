import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import components from '../features/mdx-components';
import getData from './get-data';

const getPageData = async (slug) => {
  // try {
    console.log(getData('pages'));
    let page = undefined;

    if (slug === 'about') {
      page = getData('pages/about')[0];
    }

    if (slug === 'thank-you') {
      page = getData(`pages/thank-you`)[0];
    }
    console.log(page);
    page.content = await renderToString(page.content, {
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
