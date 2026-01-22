<?php
// ------------------------
// CORS
// ------------------------
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ------------------------
// Dependencies
// ------------------------
require_once __DIR__ . "/../middleware/adminOnly.php";
require_once __DIR__ . "/../config/database.php";

// ------------------------
// Validate ID
// ------------------------
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Product ID is required"]);
    exit;
}

$productId = intval($_GET['id']);

// ------------------------
// Fetch product (to delete image)
// ------------------------
$stmt = $conn->prepare("SELECT image FROM products WHERE id = ?");
$stmt->execute([$productId]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    http_response_code(404);
    echo json_encode(["message" => "Product not found"]);
    exit;
}

// ------------------------
// Delete image file (if exists)
// ------------------------
if (!empty($product['image'])) {
    $imagePath = __DIR__ . "/../uploads/" . $product['image'];
    if (file_exists($imagePath)) {
        unlink($imagePath);
    }
}

// ------------------------
// Delete product from DB
// ------------------------
$stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
$stmt->execute([$productId]);

echo json_encode(["message" => "Product deleted successfully"]);
?>