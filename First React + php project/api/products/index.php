<?php
    // Allow React dev server to access this API
    header("Access-Control-Allow-Origin: *"); // For dev only, later use exact domain in production
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    // Optional: handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }

    // Fetch all products from database
    require_once __DIR__ . "/../config/database.php"; // DB connection

    header("Content-Type: application/json; charset=UTF-8");

    try {
        // Select all product fields needed for frontend
        $stmt = $conn->query("SELECT id, name, description, price, stock, image FROM products");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return products directly for Redux
        echo json_encode($products);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => $e -> getMessage()
        ]);
    }
?>