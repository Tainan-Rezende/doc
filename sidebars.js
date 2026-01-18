/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Autenticação',
      collapsed: true,
      items: [
        'autenticacao/login',
      ]
    },
    {
      type: 'category',
      label: 'FIAT',
      items: [
        {
          type: 'category',
          label: 'Pix - Cliente',
          items: [
            'fiat/pix-cliente/chaves-pix'
          ]
        }
      ]
    }
  ]
};

export default sidebars;