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

    /**
     * Serves the main Thymeleaf UI page for the ordering system.
     */
    @GetMapping("/ordering-system")
    public String orderingSystemPage() {
        return "ordering-system";
    }

    /**
     * REST API to retrieve all orders from the database.
     */
    @GetMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * REST API to retrieve a single order by its ID.
     */
    @GetMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * REST API to create a new order.
     * Includes error handling for runtime exceptions during order processing.
     */
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

    /**
     * REST API to update order status (e.g., PENDING, COMPLETED, CANCELLED).
     * Extracts 'status' from a JSON body to match the frontend fetch request.
     */
    @PutMapping("/api/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    /**
     * REST API to update payment status for an order.
     */
    @PutMapping("/api/orders/{id}/payment")
    @ResponseBody
    public ResponseEntity<Order> updatePayment(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        String paymentStatus = body.get("paymentStatus");
        return ResponseEntity.ok(orderService.updatePaymentStatus(id, paymentStatus));
    }

    /**
     * REST API to permanently delete an order record.
     */
    @DeleteMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * REST API to search for orders by customer name.
     */
    @GetMapping("/api/orders/search")
    @ResponseBody
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String name) {
        return ResponseEntity.ok(orderService.searchByCustomer(name));
    }
}
