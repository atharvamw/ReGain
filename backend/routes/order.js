import express from 'express';
import { 
    handlePlaceOrder, 
    handleGetSellerPendingOrders, 
    handleGetSellerOrders,
    handleGetBuyerOrders,
    handleUpdateOrderStatus,
    handleGetOrderById,
    handleAcceptOrder,
    handleRejectOrder
} from '../controller/order.js';

const router = express.Router();

// Buyer routes
router.post("/placeOrder", handlePlaceOrder);
router.get("/myOrders", handleGetBuyerOrders);

// Seller routes
router.get("/sellerPendingOrders", handleGetSellerPendingOrders);
router.get("/sellerOrders", handleGetSellerOrders);
router.post("/acceptOrder", handleAcceptOrder);  // Accept/Approve order
router.post("/rejectOrder", handleRejectOrder);  // Reject/Cancel order
router.post("/updateOrderStatus", handleUpdateOrderStatus);  // For shipping/delivered

// Common routes
router.get("/order/:orderId", handleGetOrderById);

export default router;