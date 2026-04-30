package com.ordering.system.controller;

import com.ordering.system.entity.Order;
import com.ordering.system.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Thymeleaf page
    @GetMapping("/ordering-system")
    public String orderingSystemPage() {
        return "ordering-system";
    }

    // REST - Get all orders
    @GetMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // REST - Get order by ID
    @GetMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

 // REST - Create order
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

    // REST - Update order status
    @PutMapping("/api/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }

    // REST - Update payment status
    @PutMapping("/api/orders/{id}/payment")
    @ResponseBody
    public ResponseEntity<Order> updatePayment(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            orderService.updatePaymentStatus(id, body.get("paymentStatus")));
    }

    // REST - Delete order
    @DeleteMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // REST - Search by customer
    @GetMapping("/api/orders/search")
    @ResponseBody
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String name) {
        return ResponseEntity.ok(orderService.searchByCustomer(name));
    }
}