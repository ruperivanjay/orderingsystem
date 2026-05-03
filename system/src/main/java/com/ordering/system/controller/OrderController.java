package com.ordering.system.controller;

import com.ordering.system.entity.Order;
import com.ordering.system.entity.Product;
import com.ordering.system.service.OrderService;
import com.ordering.system.service.ProductService; // You need to import this
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@CrossOrigin(origins = "*") // Helps prevent CORS errors between frontend and backend
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService; // Add this service

    public OrderController(OrderService orderService, ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }

    // Serves the HTML Page
    @GetMapping("/ordering-system")
    public String orderingSystemPage() {
        return "ordering-system";
    }

    // --- PRODUCT ENDPOINTS (This fixes the 404 error from your screenshots) ---
    
    @GetMapping("/api/products")
    @ResponseBody
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // --- ORDER ENDPOINTS ---

    @GetMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order created = orderService.createOrder(order);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            java.util.Map<String, String> error = new java.util.HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/api/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @PutMapping("/api/orders/{id}/payment")
    @ResponseBody
    public ResponseEntity<Order> updatePayment(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            orderService.updatePaymentStatus(id, body.get("paymentStatus")));
    }

    @DeleteMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/orders/search")
    @ResponseBody
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String name) {
        return ResponseEntity.ok(orderService.searchByCustomer(name));
    }
}
