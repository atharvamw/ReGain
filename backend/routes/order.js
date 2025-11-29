import express from 'express';
import { 
    handlePlaceOrder, 
    handleGetSellerPendingOrders, 
    handleGetSellerOrders,
    handleGetBuyerOrders,
    handleUpdateOrderStatus,
    handleGetOrderById
} from '../controller/order.js';

const router = express.Router();

// Buyer routes
router.post("/placeOrder", handlePlaceOrder);
router.get("/myOrders", handleGetBuyerOrders);

// Seller routes
router.get("/sellerPendingOrders", handleGetSellerPendingOrders);
router.get("/sellerOrders", handleGetSellerOrders);
router.post("/updateOrderStatus", handleUpdateOrderStatus);

// Common routes
router.get("/order/:orderId", handleGetOrderById);

export default router;