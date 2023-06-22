import { visit } from 'unist-util-visit';

const svg = {
  type: 'span',
  data: { hName: 'span' },
  children: [
    {
      type: 'svg',
      data: {
        hName: 'svg',
        hProperties: {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '14',
          height: '16',
          viewBox: '0 0 14 16',
        },
      },
      children: [
        {
          type: 'path',
          data: {
            hName: 'path',
            hProperties: {
              fill: 'currentColor',
              d: 'M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z',
            },
          },
        },
      ],
    },
  ],
};

export function admonitionDirective() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const data = node.data || (node.data = {});

        switch (node.name) {
          case 'important':
            data.hProperties = {
              class: 'admonition-content admonition-important',
            };
            break;
          case 'info':
            data.hProperties = {
              class: 'admonition-content admonition-info',
            };
            break;
          case 'warning':
            data.hProperties = {
              class: 'admonition-content admonition-warning',
            };
            break;
          case 'tip':
            data.hProperties = {
              class: 'admonition-content admonition-tip',
            };
            break;
          case 'caution':
            data.hProperties = {
              class: 'admonition-content admonition-caution',
            };
            break;
          default:
            return;
        }

        let h5Child;

        if (node.children.length === 1) {
          h5Child = {
            type: 'heading',
            data: {
              hName: 'h5',
            },
            children: [{ type: 'text', value: node.name }],
          };
        } else {
          const firstChild = node.children[0];
          firstChild.data.hName = 'h5';
          h5Child = firstChild;
          node.children.splice(0, 1);
        }

        const container = {
          type: 'div',
          data: {
            hName: 'div',
            hProperties: {
              class: 'admonition-label',
            },
          },
          children: [svg, h5Child],
        };
        node.children.unshift(container);
      }
    });
  };
}
