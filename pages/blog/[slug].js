import React from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'

const components = {}

export default function BlogIndex({data, source}) {
  const content = hydrate(source, {components})
  return (
    <div>
      {content}
    </div>
  )
}

const getArticlesData = async (link = 'https://api.sourcerio.com/blogging/v1/blogs/driggl/articles/') => {
  const response  = await fetch(link);
  const body = await response.json();
  const {data, links: {next}} = body;
  if (next) {
    return data.concat(await getArticlesData(next))
  } else {
    return data
  }
} 

export async function getStaticPaths() {
  const posts = await getArticlesData();
  const paths = posts.map(article => ({params: {slug: article.attributes.slug}}))
  return {paths, fallback: false}
}

export async function getStaticProps(context) {
  const res = await fetch(`https://api.sourcerio.com/blogging/v1/blogs/driggl/articles/${context.params.slug}`)
  const data = await res.json()

  const content = data.data.attributes.content

  const mdxSource = await renderToString(content, {
    components,
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  })

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data, source: mdxSource }, // will be passed to the page component as props
  }
}