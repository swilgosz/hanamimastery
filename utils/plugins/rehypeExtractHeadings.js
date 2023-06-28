import { hasProperty } from 'hast-util-has-property';
import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

export function rehypeExtractHeadings({ headings }) {
  return (tree) => {
    visit(tree, (node) => {
      if (hasProperty(node, 'id')) {
        if (headingRank(node) === 2) {
          headings.push({
            title: toString(node),
            id: node.properties.id.toString(),
            children: [],
          });
        } else if (headingRank(node) === 3) {
          if (headings.length === 0)
            throw new Error(
              'Wrong structure of headings in article, <h3> cannot be the first heading'
            );
          headings[headings.length - 1].children.push({
            title: toString(node),
            id: node.properties.id.toString(),
          });
        }
      }
    });
  };
}
