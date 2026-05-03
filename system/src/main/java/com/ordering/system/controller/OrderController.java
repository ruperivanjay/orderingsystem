package com.ordering.system.controller;

import com.ordering.system.entity.Order;
import com.ordering.system.entity.Product; // Ensure you have a Product entity
import com.ordering.system.service.OrderService;
import com.ordering.system.service.ProductService; // Ensure you have a ProductService
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService; // Added ProductService

    public OrderController(OrderService orderService, ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }

    @GetMapping("/ordering-system")
    public String orderingSystemPage() {
        return "ordering-system";
    }

    // NEW: Endpoint to fix the 404 error in your screenshot
    @GetMapping("/api/products")
    @ResponseBody
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order created = orderService.createOrder(order);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            Map<String, String> error = new java.util.HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/api/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @DeleteMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
