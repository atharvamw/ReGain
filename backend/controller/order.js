import jwt from 'jsonwebtoken';
import {
    createOrder,
    getSellerPendingOrders,
    getSellerOrders,
    getBuyerOrders,
    updateOrderStatus,
    getOrderById
} from '../models/order.js';
import { getName } from '../models/auth.js';

// Place a new order
export async function handlePlaceOrder(req, res) {
    /*
    JSON Body format:
    {
        siteId: "mongoId",
        siteName: "Site Name",
        sellerEmail: "seller@example.com",
        materials: {
            "bricks": { quantity: 100, price: 10 },
            "cement": { quantity: 50, price: 20 }
        },
        totalAmount: 2000,
        shippingAddress: {
            street: "123 Main St",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            coordinates: [19.0760, 72.8777]
        }
    }
    */
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const { siteId, siteName, sellerEmail, materials, totalAmount, shippingAddress } = req.body;

        // Validation
        if (!siteId || !siteName || !sellerEmail || !materials || !totalAmount) {
            return res.json({ status: "failed", message: "Missing required fields" });
        }

        if (typeof materials !== "object" || Object.keys(materials).length === 0) {
            return res.json({ status: "failed", message: "At least one material is required" });
        }

        if (typeof totalAmount !== "number" || totalAmount <= 0) {
            return res.json({ status: "failed", message: "Invalid total amount" });
        }

        // Get buyer details
        const buyerDetails = await getName(token.email);

        if (buyerDetails.status !== "success") {
            return res.json({ status: "failed", message: "Failed to fetch buyer details" });
        }

        const orderData = {
            buyerEmail: token.email,
            sellerEmail,
            siteId,
            siteName,
            materials,
            totalAmount,
            buyerDetails: {
                firstName: buyerDetails.firstName,
                lastName: buyerDetails.lastName,
                phone: buyerDetails.phone
            },
            shippingAddress: shippingAddress || {}
        };

        const result = await createOrder(orderData);
        return res.json(result);

    } catch (err) {
        console.error("Place Order Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Get pending orders for seller (dashboard)
export async function handleGetSellerPendingOrders(req, res) {
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const result = await getSellerPendingOrders(token.email);
        return res.json(result);

    } catch (err) {
        console.error("Get Pending Orders Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Get all orders for seller
export async function handleGetSellerOrders(req, res) {
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const result = await getSellerOrders(token.email);
        return res.json(result);

    } catch (err) {
        console.error("Get Seller Orders Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Get all orders for buyer
export async function handleGetBuyerOrders(req, res) {
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const result = await getBuyerOrders(token.email);
        return res.json(result);

    } catch (err) {
        console.error("Get Buyer Orders Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Update order status (approve/ship/deliver/cancel)
export async function handleUpdateOrderStatus(req, res) {
    /*
    JSON Body format:
    {
        orderId: "mongoId",
        status: "approved" | "shipping" | "delivered" | "cancelled" | "completed"
    }
    */
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ status: "failed", message: "Order ID and status are required" });
        }

        const result = await updateOrderStatus(orderId, token.email, status);
        return res.json(result);

    } catch (err) {
        console.error("Update Order Status Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Get order details by ID
export async function handleGetOrderById(req, res) {
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const { orderId } = req.params;

        if (!orderId) {
            return res.json({ status: "failed", message: "Order ID is required" });
        }

        const result = await getOrderById(orderId, token.email);
        return res.json(result);

    } catch (err) {
        console.error("Get Order Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Accept/Approve order (Seller)
export async function handleAcceptOrder(req, res) {
    /*
    JSON Body format:
    {
        orderId: "mongoId"
    }
    */
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ status: "failed", message: "Order ID is required" });
        }

        // Only allow accepting pending orders
        const result = await updateOrderStatus(orderId, token.email, 'approved');
        return res.json(result);

    } catch (err) {
        console.error("Accept Order Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}

// Reject order (Seller)
export async function handleRejectOrder(req, res) {
    /*
    JSON Body format:
    {
        orderId: "mongoId",
        reason: "Optional rejection reason"
    }
    */
    try {
        if (!req.cookies?.token) {
            return res.json({ status: "failed", message: "Please login first" });
        }

        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        if (!token) {
            return res.json({ status: "failed", message: "Invalid authentication" });
        }

        const { orderId, reason } = req.body;

        if (!orderId) {
            return res.json({ status: "failed", message: "Order ID is required" });
        }

        const result = await updateOrderStatus(orderId, token.email, 'cancelled');

        // You can extend this to save the rejection reason if needed
        return res.json(result);

    } catch (err) {
        console.error("Reject Order Error:", err);
        return res.json({ status: "error", message: err.toString() });
    }
}