<?php
    require_once __DIR__ . "/../middleware/auth.php";
    require_once __DIR__ . "/../config/database.php";

    header("Content-Type: application/json");

    $id = $_GET['id'] ?? null;
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Product ID is required"]);
        exit;
    }

    $name = $input['name'] ?? '';
    $description = $input['description'] ?? '';
    $price = $input['price'] ?? '';
    $stock = $input['stock'] ?? '';

    $stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?");
    $stmt->execute([$name, $description, $price, $stock, $id]);

    echo json_encode(["message" => "Product updated successfully"]);
?>