import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import EpisodesGrid from "../features/episodes-grid/index";
import ArticleLayout from "../layouts/article-layout";
import HomePageSchema from "../features/content-schemas/homepage-schema";
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
        title="Newest Hanami screencasts, articles, and video tutorials"
        titleTemplate="%s | Hanami Mastery - learn Hanami as a pro"
        description="Get familiar with Hanami framework and realise that Ruby is not only Rails!"
        openGraph={{
          title: "Recent articles",
          description:
            "Get familiar with Hanami framework and realise that Ruby is not only Rails! Newest episodes with screencasts related to Hanami!",
          images: ["/images/logo-hm.jpeg"],
          type: "website",
        }}
      />
      <HomePageSchema />
      <ArticleLayout article={<EpisodesGrid articles={posts} />} />
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
