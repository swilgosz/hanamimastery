import React from 'react'

export default function BlogIndex({data}) {
  return (
    <div>
      Hi
    </div>
  )
}


export async function getStaticProps(context) {
  const res = await fetch(`https://api.sourcerio.com/blogging/v1/blogs/driggl/articles`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}