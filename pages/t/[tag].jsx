import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ContentGrid from "../../features/content-grid/index";
import ArticleLayout from "../../layouts/article-layout";
import { setAuthors } from "../../redux/slices/authors";
import { getAllContent, getAllFilesFrontMatter } from "../../utils";

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
      <ArticleLayout article={<ContentGrid items={posts} />} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllContent();
  const posts = allPosts.filter((item) => (item.tags.includes(params.tag)));
  const authors = await getAllFilesFrontMatter("team");

  return {
    props: { posts, authors }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const items = await getAllContent();
  const arr = items.map((p) => (p.tags));
  const allTags = [].concat(...arr);
  const tags = [...new Set(allTags)]
  return {
    paths: tags.map((t) => ({
      params: {
        tag: t,
      },
    })),
    fallback: false,
  };
}
