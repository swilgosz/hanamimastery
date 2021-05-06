import renderToString from "next-mdx-remote/render-to-string";
import rehypePrism from "@mapbox/rehype-prism";
import components from "../features/mdx-components";
import getData from "./get-data";

const getPageData = async (slug) => {
  const { objects: page } = getData(`pages/${slug}`);

  const content = await renderToString(page[0].content, {
    components,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypePrism],
    },
  });
  return { page, content };
};

export default getPageData;
