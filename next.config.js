module.exports = {
  async redirects() {
    return [
      /*
        for redirects to work on statically generated site (via "next export"), also create a file in /pages, i.e.:

        // pages/job.html
        import redirect from 'nextjs-redirect';
        export default redirect('/jobs', { statusCode: 301 });
      */
      {
        source: "/episodes",
        destination: "/",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
};
