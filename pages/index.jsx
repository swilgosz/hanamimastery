import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ArticlesGrid from "../features/articles-grid/index";
import ArticleLayout from "../layouts/article-layout";
import { setAuthors } from "../redux/slices/authors";
import { getAllFilesFrontMatter } from "../utils";

export default function BlogIndex({ posts, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
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
  const authors = await getAllFilesFrontMatter("team");

  return {
    props: { posts, authors }, // will be passed to the page component as props
  };
}
