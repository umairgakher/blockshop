export const formatAddress = (value) => `${value.slice(0, 6)}...${value.slice(-4)}`

export const formatPrice = (value) => Number(value).toFixed(4)
