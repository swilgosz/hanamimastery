import React from "react";

function makeHomePageSchema() {
  return {
      '@context': 'http://schema.org',
      '@type': 'Blog',
      name: 'Hanami Mastery',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      description: "Master the Hanami Ruby framework in no time with high-quality video guides and articles!",
      keywords: "hanami, hanamirb, ruby, web development",
      name: 'Hanami Mastery',
      about: {
        url: "${process.env.NEXT_PUBLIC_BASE_URL}/about`",
        name: "About",
        description: "Hanami Mastery is an initiative to help Hanami community grow."
      },
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo-hm.png`,
      alternateName: "HanamiMastery",
      inLanguage: 'en-US',
      mainEntity: [
        { '@type': 'SiteNavigationElement', name: 'Episodes', url: `${process.env.NEXT_PUBLIC_BASE_URL}` },
        { '@type': 'SiteNavigationElement', name: 'Stray', url: `${process.env.NEXT_PUBLIC_BASE_URL}/c/stray` },
        { '@type': 'SiteNavigationElement', name: 'About', url: `${process.env.NEXT_PUBLIC_BASE_URL}/about` },
        { '@type': 'SiteNavigationElement', name: 'Sponsors', url: `${process.env.NEXT_PUBLIC_BASE_URL}/sponsors` },
        { '@type': 'SiteNavigationElement', name: 'RSS', url: `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml` }
      ],
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
      sameAs: [
        'https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ',
        'https://twitter.com/hanamimastery',
        'https://facebook.com/hanamimasteryfb',
        'https://github.com/hanamimastery'
      ]
  }
}

export default function HomePageSchema({ episode }) {
  return (
      <script
          key={`blogJSON-homepage`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeHomePageSchema(episode)) }}
      />
  )
}
