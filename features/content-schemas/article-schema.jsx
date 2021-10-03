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
      headline: article.title,
      image: `${process.env.NEXT_PUBLIC_BASE_URL}${article.thumbnail.big}`,
      alternateName: article.alias,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: 'Sebastian Wilgosz',
        url: 'https://twitter.com/sebwilgosz',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/images/team/swilgosz-medium.jpg`,
        description: "A creator of HanamiMastery, productivity madman. I love to make others' lives better as mine is quite good already:) My Bio links: https://bio.link/swilgosz"
      },
      publisher: {
        '@type': "Organization",
        name: 'Hanami Mastery',
        url: 'https://hanamimastery.com'
      },
      video: {
        '@type': 'VideoObject',
        name: article.title,
        description: article.excerpt,
        uploadDate: article.publishedAt,
        thumbnailUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${article.thumbnail.big}`,
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
