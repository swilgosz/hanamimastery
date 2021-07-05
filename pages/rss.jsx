import RSS from "rss";

import { getRssData } from "../utils";

export default () => {};

// const blogPosts = getRssXml(fetchMyPosts());
// const posts = await getFiles("stray");
// const episodes = await getFiles("episodes");

/**
 * @type import("next").GetServerSideProps
 */
export async function getServerSideProps(context) {
  const { res } = context;
  const rssData = await getRssData();
  res.setHeader("Content-Type", "text/xml");
  res.write(rssData.xml());
  res.end();
  return { props: {} };
}
