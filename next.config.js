const nextConfig = {
  async redirects() {
    return [
      /*
        for redirects to work on statically generated site (via "next export"), also create a file in /pages, i.e.:

        // pages/job.html
        import redirect from 'nextjs-redirect';
        export default redirect('/jobs', { statusCode: 301 });
      */
      // {
      //   source: "/episodes",
      //   destination: "/",
      //   permanent: true,
      // },
      {
        source: '/feed',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/feed.xml',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

export default nextConfig;
