import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    buyerEmail: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    siteName: { type: String, required: true },
    materials: {
        type: Map,
        of: new mongoose.Schema({
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }, { _id: false })
    },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'shipping', 'delivered', 'cancelled', 'completed'],
        default: 'pending'
    },
    buyerDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true }
    },
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        coordinates: { type: [Number] }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: "orders" });

const Order = mongoose.model("Order", orderSchema);

// Create a new order request
export async function createOrder(orderData) {
    try {
        const newOrder = await Order.create(orderData);
        return { status: "success", data: newOrder, message: "Order created successfully" };
    } catch (err) {
        console.error("Database error in createOrder:", err);
        return { status: "error", message: "Failed to create order: " + err.message };
    }
}

// Get pending orders for a seller
export async function getSellerPendingOrders(sellerEmail) {
    try {
        const orders = await Order.find({
            sellerEmail,
            status: 'pending'
        }).sort({ createdAt: -1 });

        return { status: "success", data: orders };
    } catch (err) {
        return { status: "error", message: "Failed to fetch pending orders: " + err.message };
    }
}

// Get all orders for a seller (for dashboard)
export async function getSellerOrders(sellerEmail) {
    try {
        const orders = await Order.find({ sellerEmail }).sort({ createdAt: -1 });
        return { status: "success", data: orders };
    } catch (err) {
        return { status: "error", message: "Failed to fetch seller orders: " + err.message };
    }
}

// Get all orders for a buyer (for dashboard)
export async function getBuyerOrders(buyerEmail) {
    try {
        const orders = await Order.find({ buyerEmail }).sort({ createdAt: -1 });
        return { status: "success", data: orders };
    } catch (err) {
        return { status: "error", message: "Failed to fetch buyer orders: " + err.message };
    }
}

// Update order status (approve, ship, deliver, cancel)
export async function updateOrderStatus(orderId, sellerEmail, newStatus) {
    try {
        const validStatuses = ['approved', 'shipping', 'delivered', 'cancelled', 'completed'];

        if (!validStatuses.includes(newStatus)) {
            return { status: "failed", message: "Invalid status" };
        }

        const order = await Order.findOneAndUpdate(
            { _id: orderId, sellerEmail },
            { status: newStatus, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return { status: "failed", message: "Order not found or unauthorized" };
        }

        return { status: "success", data: order, message: `Order ${newStatus} successfully` };
    } catch (err) {
        if (err.name === "CastError") {
            return { status: "error", message: "Invalid order ID" };
        }
        return { status: "error", message: err.message };
    }
}

// Get order by ID
export async function getOrderById(orderId, userEmail) {
    try {
        const order = await Order.findOne({
            _id: orderId,
            $or: [{ buyerEmail: userEmail }, { sellerEmail: userEmail }]
        });

        if (!order) {
            return { status: "failed", message: "Order not found or unauthorized" };
        }

        return { status: "success", data: order };
    } catch (err) {
        if (err.name === "CastError") {
            return { status: "error", message: "Invalid order ID" };
        }
        return { status: "error", message: err.message };
    }
}

export default Order;