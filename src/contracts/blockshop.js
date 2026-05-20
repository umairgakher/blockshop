export const CONTRACT_ADDRESS = '0x3381d2f3E5d41c33D85C203621C3974d10B468D8'
export const SEPOLIA_CHAIN_ID = 11155111n
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'productId', type: 'uint256' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' }
    ],
    name: 'placeOrder',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'productId', type: 'uint256' }],
    name: 'getProduct',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'price', type: 'uint256' },
          { internalType: 'uint256', name: 'stock', type: 'uint256' },
          { internalType: 'uint256', name: 'sold', type: 'uint256' },
          { internalType: 'string', name: 'imageURI', type: 'string' },
          { internalType: 'bool', name: 'isActive', type: 'bool' }
        ],
        internalType: 'struct Blockshop.Product',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllProducts',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'price', type: 'uint256' },
          { internalType: 'uint256', name: 'stock', type: 'uint256' },
          { internalType: 'uint256', name: 'sold', type: 'uint256' },
          { internalType: 'string', name: 'imageURI', type: 'string' },
          { internalType: 'bool', name: 'isActive', type: 'bool' }
        ],
        internalType: 'struct Blockshop.Product[]',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  }
]
