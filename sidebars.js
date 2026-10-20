/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Autenticação',
      items: ['authentication/login']
    },
    {
      type: 'category',
      label: 'Clientes',
      items: [
        'customer/search',
        'customer/create',
        'customer/update',
        {
          type: 'category',
          label: 'Chaves Pix',
          items: ['fiat/pix/keys', 'fiat/pix/add', 'fiat/pix/delete']
        },
        {
          type: 'category',
          label: 'Carteiras Crypto',
          items: ['crypto/customer/wallet']
        }
      ]
    },
    {
      type: 'category',
      label: 'Depósitos',
      items: [
        {
          type: 'category',
          label: 'FIAT',
          key: 'depositos-fiat',
          items: ['fiat/deposit/currency', 'fiat/deposit/create']
        },
        {
          type: 'category',
          label: 'Crypto (com Conversão)',
          key: 'depositos-crypto',
          items: [
            'crypto/deposit/cryptocurrency',
            'crypto/deposit/create',
            'crypto/deposit/network',
            'crypto/deposit/price'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Saques',
      items: [
        {
          type: 'category',
          label: 'FIAT',
          key: 'saques-fiat',
          items: ['fiat/withdraw/currency', 'fiat/withdraw/create']
        },
        {
          type: 'category',
          label: 'Crypto (com Conversão)',
          key: 'saques-crypto-conversao',
          items: [
            'crypto/withdraw/conversion/cryptocurrency',
            'crypto/withdraw/create',
            'crypto/withdraw/price-usdt'
          ]
        },
        {
          type: 'category',
          label: 'Crypto (Wallet)',
          key: 'saques-crypto-wallet',
          items: [
            'crypto/withdraw/network',
            'crypto/withdraw/wallet/cryptocurrency',
            'crypto/withdraw/create-external',
            'crypto/withdraw/price-external'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Compra e Venda de Cripto',
      key: 'compra-venda-cripto',
      items: [
        'buy-sell/overview',
        'buy-sell/conventions',
        'buy-sell/options',
        {
          type: 'category',
          label: 'Compra',
          items: [
            'buy-sell/quotes',
            'buy-sell/purchases/create',
            // 'buy-sell/purchases/from-deposit' (draft: publicar quando o canal for ligado)
          ]
        },
        {
          type: 'category',
          label: 'Venda',
          items: [
            'buy-sell/sales/sell'
          ]
        },
        'buy-sell/errors'
      ]
    },
    {
      type: 'category',
      label: 'Webhooks',
      items: [
        'webhooks/receive',
        {
          type: 'category',
          label: 'Depósitos Webhook',
          items: ['webhooks/deposit/status', 'webhooks/deposit/resend']
        },
        {
          type: 'category',
          label: 'Saques Webhook',
          items: ['webhooks/withdraw/status', 'webhooks/withdraw/resend']
        },
        {
          type: 'category',
          label: 'Compras Cripto Webhook',
          items: ['webhooks/purchase/status', 'webhooks/purchase/receive']
        },
        {
          type: 'category',
          label: 'Vendas Cripto Webhook',
          items: ['webhooks/sale/status', 'webhooks/sale/receive']
        }
      ]
    },
    {
      type: 'category',
      label: 'Empresa',
      items: [
        'company/get-balance',
        'company/sub-account',
        'company/sub-account-webhook',
        'company/sub-account-ip'
      ]
    }
  ]
};

export default sidebars;