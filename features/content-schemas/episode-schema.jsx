import React from "react";

function makeEpisodeSchema(episode) {
  return {
      '@context': 'http://schema.org',
      '@type': 'Article',
      datePublished: episode.publishedAt,
      dateModified: episode.modifiedAt || episode.publishedAt,
      url: episode.url,
      description: episode.excerpt,
      keywords: episode.topics.toString(),
      name: episode.fullTitle,
      headline: episode.fullTitle,
      image: episode.thumbnail.big,
      alternateName: episode.aliases[0],
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
        name: episode.fullTitle,
        description: episode.excerpt,
        uploadDate: episode.publishedAt,
        thumbnailUrl: episode.thumbnail.big,
        embedUrl: `https://www.youtube.com/embed/${episode.videoId}`,
        datePublished: episode.publishedAt,
        inLanguage: 'en-US'
      }
  }
}

export default function EpisodeSchema({ episode }) {
  return (
      <script
          key={`articleJSON-${episode.id}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeEpisodeSchema(episode)) }}
      />
  )
}
