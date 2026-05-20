import { ethers } from 'ethers'
import { FALLBACK_IMAGE } from '../contracts/blockshop'

export const mapProduct = (product) => ({
  id: Number(product.id),
  name: product.name,
  description: product.description,
  priceWei: product.price,
  priceEth: ethers.formatEther(product.price),
  stock: Number(product.stock),
  sold: Number(product.sold),
  imageURI: product.imageURI || FALLBACK_IMAGE,
  isActive: product.isActive
})
