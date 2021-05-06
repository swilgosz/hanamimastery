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
};
