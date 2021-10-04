import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ContentGrid from "../../features/content-grid/index";
import ArticleLayout from "../../layouts/article-layout";
import { setAuthors } from "../../redux/slices/authors";
import { getAllContent, getAllFilesFrontMatter } from "../../utils";

export default function BlogIndex({ posts, authors, tag }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title={`Articles and episodes about ${tag}`}
        titleTemplate="%s | Hanami Mastery - learn hanami as a pro"
        description={`Newest Hanami Mastery content related to ${tag} topic!`}
        openGraph={{
          title: `Articles and episodes about ${tag}`,
          description: `Newest Hanami Mastery content related to ${tag} topic!`,
          images: ["/images/logo-hm.jpeg"],
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
    props: { posts, authors, tag: params.tag }, // will be passed to the page component as props
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
