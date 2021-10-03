import React from "react";

function makeArticleSchema(article) {
  // const desc = stripHTML(article.excerpt)
  return {
      // schema truncated for brevity
      '@context': 'http://schema.org',
      '@type': 'Article',
      datePublished: article.publishedAt,
      dateModified: article.modifiedAt || article.publishedAt,
      url: article.url,
      description: article.excerpt,
      keywords: article.tags.toString(),
      name: article.title,
      image: `${process.env.NEXT_PUBLIC_BASE_URL}${article.thumbnail.big}`,
      alternateName: article.alias,
      inLanguage: 'en-US',
      video: {
        '@type': 'VideoObject',
        embedUrl: `https://www.youtube.com/embed/${article.videoId}`,
        datePublished: article.publishedAt,
        inLanguage: 'en-US'
      }
  }
}

export default function ArticleSchema({ article }) {
  return (
      <script
          key={`articleJSON-${article.id}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeArticleSchema(article)) }}
      />
  )
}
