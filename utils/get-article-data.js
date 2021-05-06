import renderToString from "next-mdx-remote/render-to-string";
import rehypePrism from "@mapbox/rehype-prism";
import components from "../features/mdx-components";
import getData from "./get-data";

const getArticleData = async (slug) => {
  const articles = getData(`episodes/${slug}`);

  const article = articles[0];

  const content = await renderToString(article.content, {
    components,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypePrism],
    },
  });
  return { article, content };
};

export default getArticleData;
