/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Autenticação',
      collapsed: true,
      items: [
        'authentication/login',
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
            'fiat/pix/keys',
            'fiat/pix/add',
            'fiat/pix/delete'
          ]
        },
        {
          type: 'category',
          label: 'Depósitos',
          items: [
            'fiat/deposit/currency',
            'fiat/deposit/create'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Clientes',
      items: [
        'customer/create'
      ]
    },
  ]
};

export default sidebars;