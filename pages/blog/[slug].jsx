import React from 'react';
import getArticlesData from '../../utils/get-articles-data';

export default function BlogIndex({ data }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: data.data.attributes.content }} />
  );
}

export async function getStaticPaths() {
  const { articles } = await getArticlesData();
  const paths = Object.values(articles).map((article) => ({
    params: { slug: article.attributes.slug },
  }));
  console.log(paths);
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const res = await fetch(
    `https://api.sourcerio.com/blogging/v1/blogs/driggl/articles/${context.params.slug}`
  );
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}
