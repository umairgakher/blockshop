// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Blockshop is Ownable, Pausable, ReentrancyGuard {
    using Address for address payable;

    uint256 public productCount;
    uint256 public orderCount;
    uint256 public pendingRevenue;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 stock;
        uint256 sold;
        string imageURI;
        bool isActive;
    }

    struct Order {
        uint256 id;
        address buyer;
        uint256 productId;
        uint256 quantity;
        uint256 totalPrice;
        uint256 timestamp;
        bool fulfilled;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;

    error InvalidProduct();
    error InvalidQuantity();
    error InvalidPrice();
    error InvalidStock();
    error EmptyValue();
    error ProductInactive();
    error InsufficientStock();
    error InsufficientPayment();
    error OrderNotFound();
    error OrderAlreadyFulfilled();
    error NothingToWithdraw();

    event ProductCreated(uint256 indexed id, string name, uint256 price, uint256 stock);
    event ProductUpdated(uint256 indexed id, uint256 price, uint256 stock, bool isActive);
    event OrderPlaced(uint256 indexed orderId, address indexed buyer, uint256 productId, uint256 quantity, uint256 totalPrice);
    event OrderFulfilled(uint256 indexed orderId);
    event ProductStockUpdated(uint256 indexed productId, uint256 newStock);
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createProduct(
        string memory name,
        string memory description,
        uint256 price,
        uint256 stock,
        string memory imageURI
    ) external onlyOwner returns (uint256) {
        if (bytes(name).length == 0 || bytes(description).length == 0 || bytes(imageURI).length == 0) revert EmptyValue();
        if (price == 0) revert InvalidPrice();
        if (stock == 0) revert InvalidStock();

        uint256 productId = ++productCount;
        products[productId] = Product({
            id: productId,
            name: name,
            description: description,
            price: price,
            stock: stock,
            sold: 0,
            imageURI: imageURI,
            isActive: true
        });

        emit ProductCreated(productId, name, price, stock);
        return productId;
    }

    function updateProduct(uint256 productId, uint256 price, uint256 stock, bool isActive) external onlyOwner {
        Product storage product = _getExistingProduct(productId);

        if (price == 0) revert InvalidPrice();

        product.price = price;
        product.stock = stock;
        product.isActive = isActive;

        emit ProductUpdated(productId, price, stock, isActive);
        emit ProductStockUpdated(productId, stock);
    }

    function setProductStatus(uint256 productId, bool isActive) external onlyOwner {
        Product storage product = _getExistingProduct(productId);
        product.isActive = isActive;

        emit ProductUpdated(productId, product.price, product.stock, isActive);
    }

    function addProductStock(uint256 productId, uint256 additionalStock) external onlyOwner {
        Product storage product = _getExistingProduct(productId);

        if (additionalStock == 0) revert InvalidStock();

        product.stock += additionalStock;

        emit ProductStockUpdated(productId, product.stock);
        emit ProductUpdated(productId, product.price, product.stock, product.isActive);
    }

    function placeOrder(uint256 productId, uint256 quantity) external payable nonReentrant whenNotPaused returns (uint256) {
        Product storage product = _getExistingProduct(productId);

        if (!product.isActive) revert ProductInactive();
        if (quantity == 0) revert InvalidQuantity();
        if (product.stock < quantity) revert InsufficientStock();

        uint256 totalPrice = product.price * quantity;
        if (msg.value < totalPrice) revert InsufficientPayment();

        uint256 orderId = ++orderCount;
        orders[orderId] = Order({
            id: orderId,
            buyer: msg.sender,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice,
            timestamp: block.timestamp,
            fulfilled: false
        });

        userOrders[msg.sender].push(orderId);
        product.stock -= quantity;
        product.sold += quantity;
        pendingRevenue += totalPrice;

        emit OrderPlaced(orderId, msg.sender, productId, quantity, totalPrice);
        emit ProductStockUpdated(productId, product.stock);

        if (msg.value > totalPrice) {
            payable(msg.sender).sendValue(msg.value - totalPrice);
        }

        return orderId;
    }

    function fulfillOrder(uint256 orderId) external onlyOwner {
        Order storage order = orders[orderId];
        if (order.id == 0) revert OrderNotFound();
        if (order.fulfilled) revert OrderAlreadyFulfilled();

        order.fulfilled = true;
        emit OrderFulfilled(orderId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getProduct(uint256 productId) external view returns (Product memory) {
        Product storage product = _getExistingProduct(productId);
        return product;
    }

    function getOrder(uint256 orderId) external view returns (Order memory) {
        Order memory order = orders[orderId];
        if (order.id == 0) revert OrderNotFound();
        return order;
    }

    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }

    function getAllProducts() external view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) {
            allProducts[i - 1] = products[i];
        }
        return allProducts;
    }

    function withdrawFunds() external onlyOwner {
        uint256 amount = pendingRevenue;
        if (amount == 0) revert NothingToWithdraw();

        pendingRevenue = 0;
        payable(owner()).sendValue(amount);

        emit FundsWithdrawn(owner(), amount);
    }

    function _getExistingProduct(uint256 productId) internal view returns (Product storage product) {
        product = products[productId];
        if (product.id == 0) revert InvalidProduct();
    }
}
