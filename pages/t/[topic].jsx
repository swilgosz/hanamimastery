import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ContentGrid from "../../features/content-grid/index";
import ArticlesLayout from "../../layouts/articles-layout";
import { setAuthors } from "../../redux/slices/authors";
import { getContent, getContentByTopic } from "../../utils/queries";

export default function BlogIndex({ posts, authors, topic }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title={`Articles and screencasts about ${topic}`}
        titleTemplate="%s | Hanami Mastery"
        description={`Newest Hanami Mastery content related to ${topic} topic!`}
        openGraph={{
          title: `Articles and screencast episodes about ${topic}`,
          description: `Newest Hanami Mastery content related to ${topic} topic!`,
          images: ["/images/logo-hm.jpeg"],
          type: "website",
        }}
      />
      <ArticlesLayout article={
        <>
        <h1>Recent articles and screencasts related to {topic}</h1>
        <ContentGrid items={posts} />
        </>
      } />
    </>
  );
}

export async function getStaticProps({ params }) {
  const posts = await getContentByTopic(params.topic);
  const authors = await getContent("team");

  return {
    props: { posts, authors, topic: params.topic }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const items = await getContent();
  const arr = items.map((p) => (p.topics));
  const allTopics = [].concat(...arr);
  const topics = [...new Set(allTopics)]
  return {
    paths: topics.map((t) => ({
      params: {
        topic: t,
      },
    })),
    fallback: false,
  };
}
