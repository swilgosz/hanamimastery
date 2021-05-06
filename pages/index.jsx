import { NextSeo } from "next-seo";
import ArticlesGrid from "../features/articles-grid/index";
import ArticleLayout from "../layouts/article-layout";
import { getAllFilesFrontMatter } from "../utils";

export default function BlogIndex({ posts }) {
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
      <ArticleLayout article={<ArticlesGrid articles={posts} />} />
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter("episodes");

  return {
    props: { posts }, // will be passed to the page component as props
  };
}
