<?php
    // minimal config

    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

    // DB (must define $conn as PDO)
    require_once __DIR__ . '/../config/database.php';

    try {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!is_array($input)) throw new Exception("Invalid JSON", 400);

        $user_id = isset($input['user_id']) ? (int)$input['user_id'] : 0;
        if ($user_id <= 0) throw new Exception("Missing or invalid user_id", 400);

        // optional: ensure the user exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        if (!$stmt->fetch(PDO::FETCH_ASSOC)) throw new Exception("User not found", 404);

        $cart = $input['cart'] ?? [];
        if (!is_array($cart) || count($cart) === 0) throw new Exception("Cart is empty or invalid", 400);

        $conn->beginTransaction();
        $totalAmount = 0;

        foreach ($cart as $item) {
            if (!isset($item['id'], $item['quantity'], $item['price'])) {
                throw new Exception("Cart item missing id/quantity/price", 400);
            }

            $product_id = (int)$item['id'];
            $quantity = (int)$item['quantity'];
            $price = (float)$item['price'];

            if ($product_id <= 0 || $quantity <= 0 || $price < 0) {
                throw new Exception("Invalid item values", 400);
            }

            // lock row and check stock
            $stmt = $conn->prepare("SELECT stock FROM products WHERE id = ? FOR UPDATE");
            $stmt->execute([$product_id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$product) throw new Exception("Product {$product_id} not found", 404);

            $stock = (int)$product['stock'];
            if ($stock < $quantity) throw new Exception("Not enough stock for product {$product_id}", 409);

            // update stock
            $stmt = $conn->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
            $stmt->execute([$quantity, $product_id]);

            // insert purchase
            $stmt = $conn->prepare("INSERT INTO purchases (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $product_id, $quantity, $price]);

            $totalAmount += $price * $quantity;
        }

        $conn->commit();

        http_response_code(200);
        echo json_encode(["message" => "Purchase successful!", "total" => round($totalAmount, 2)]);
        exit;

    } catch (Exception $e) {
        if (isset($conn) && $conn->inTransaction()) $conn->rollBack();
        $code = (int)$e->getCode();
        if ($code < 100) $code = 500;
        http_response_code($code);
        echo json_encode(["message" => $e->getMessage()]);
        exit;
    }
?>