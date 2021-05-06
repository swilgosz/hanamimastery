import { NextSeo } from "next-seo";
import ArticlesGrid from "../features/articles-grid/index";
import getArticlesData from "../utils/get-articles-data";
import ArticleLayout from "../layouts/article-layout";

export default function BlogIndex({ articles }) {
  return (
    <>
      <NextSeo
        title="Recent articles"
        titleTemplate="%s | Hanami Mastery - learn hanami as a pro"
        description="Build modern websites like a professional with Driggl's Community!"
        openGraph={{
          title: "Recent articles",
          description:
            "Newest episodes with guides related to Hanami ruby Framework!",
          images: ["/home-cover.jpg"],
          type: "website",
        }}
      />
      <ArticleLayout article={<ArticlesGrid articles={articles} />} />
    </>
  );
}

export async function getStaticProps() {
  const { articles, authors } = await getArticlesData();

  return {
    props: { articles, authors }, // will be passed to the page component as props
  };
}
