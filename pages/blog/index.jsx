export default function BlogIndex({ data }) {
  console.log(data);
  return <div>Hi</div>;
}

export async function getStaticProps() {
  const res = await fetch(
    `https://api.sourcerio.com/blogging/v1/blogs/driggl/articles`
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
