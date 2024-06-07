import { Node, mergeAttributes } from '@tiptap/core';

const CalendlyWidget = Node.create({
  name: 'calendlyWidget',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes: () => ({
    user: {
      default: null,
    },
    meeting: {
      default: null,
    },
  }),

 parseHTML() {
    return [
      {
        tag: 'div.calendly-inline-widget',
        getAttrs: node => {
          if (typeof node === 'string') return false;
          const url = node.getAttribute('data-url');
          const match = url.match(/calendly\.com\/([^/]+)\/([^/]+)/);
          if (match) {
            return {
              user: match[1],
              meeting: match[2],
            };
          }
          return false;
        },
      },
    ];
  },


  renderHTML({ HTMLAttributes }) {
    const { user, meeting } = HTMLAttributes;
    const url = `https://calendly.com/${user}/${meeting}`;

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'class': 'calendly-inline-widget',
        'data-url': url,
        'style': 'min-width:320px;height:900px;',
      }),
    ];
  },

  addCommands() {
    return {
      setCalendlyWidget:
        (user, meeting) =>
          ({ commands }) => {
            return commands.insertContent([
              {
                type: 'paragraph',
                content: ''
              },
              {
                type: this.name,
                attrs: { user, meeting },
              },
              {
                type: 'paragraph',
                content: ''
              },
            ]);
          },
    };
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.className = 'calendly-inline-widget';
      dom.style.minWidth = '320px';
      dom.style.height = '900px';
      dom.dataset.url = `https://calendly.com/${node.attrs.user}/${node.attrs.meeting}`;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;

      dom.appendChild(script);

      return {
        dom,
        contentDOM: null,
      };
    };
  },
});

export default CalendlyWidget;
