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
        },
        {
          type: 'category',
          label: 'Saques',
          items: [
            'fiat/withdraw/currency',
            'fiat/withdraw/create'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Crypto',
      items: [
        {
          type: 'category',
          label: 'Cliente',
          items: [
            'crypto/customer/wallet'
          ]
        },
        {
          type: 'category',
          label: 'Depósito',
          items: [
            'crypto/deposit/cryptocurrency',
            'crypto/deposit/create',
            'crypto/deposit/network',
            'crypto/deposit/price'
          ]
        },
        {
          type: 'category',
          label: 'Saques',
          items: [
            'crypto/withdraw/cryptocurrency',
            'crypto/withdraw/network',
            'crypto/withdraw/create',
            'crypto/withdraw/create-external',
            'crypto/withdraw/price-usdt',
            'crypto/withdraw/price-external'
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