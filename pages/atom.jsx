import RSS from "rss";

import { getRssData } from "../utils";

export default () => {};

/**
 * @type import("next").GetServerSideProps
 */
export async function getServerSideProps(context) {
  const { res } = context;
  const rssData = await getRssData();
  res.setHeader("Content-Type", "text/xml");
  res.write(rssData.atom1());
  res.end();
  return { props: {} };
}
