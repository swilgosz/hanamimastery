import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ArticlesGrid from "../../features/articles-grid/index";
import ArticleLayout from "../../layouts/article-layout";
import { setAuthors } from "../../redux/slices/authors";
import { getAllFilesFrontMatter } from "../../utils";

export default function BlogIndex({ posts, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title="Casual articles"
        titleTemplate="%s | Hanami Mastery - learn hanami as a pro"
        description="Newest non-episode Hanami Mastery articles. Casual thinking, felietons, and others!"
        openGraph={{
          title: "Casual articles",
          description:
            "Newest non-episode Hanami Mastery articles. Casual thinking, felietons, and others!",
          images: ["/home-cover.jpg"],
          type: "website",
        }}
      />
      <ArticleLayout article={<ArticlesGrid articles={posts} />} />
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter("stray");
  const authors = await getAllFilesFrontMatter("team");

  return {
    props: { posts, authors }, // will be passed to the page component as props
  };
}
