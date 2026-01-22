<?php
    // ------------------------
    // CORS Headers
    // ------------------------
    header("Access-Control-Allow-Origin: http://localhost:5173"); // React dev server
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

    // ------------------------
    // Include dependencies
    // ------------------------
    require_once __DIR__ . "/../middleware/adminOnly.php"; // validates $user & admin
    require_once __DIR__ . "/../config/database.php";

    // ------------------------
    // Input Validation
    // ------------------------
    if (!isset($_POST['name'], $_POST['price'])) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        exit();
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== 0) {
        http_response_code(400);
        echo json_encode([
            "message" => "Image file is missing or invalid",
            "error_code" => $_FILES['image']['error'] ?? null
        ]);
        exit();
    }

    // ------------------------
    // Image Upload
    // ------------------------
    $uploadDir = __DIR__ . "/../uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $imageName = time() . "_" . basename($_FILES["image"]["name"]);
    $targetPath = $uploadDir . $imageName;

    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath)) {
        http_response_code(500);
        echo json_encode([
            "message" => "Image upload failed",
            "tmp_name_exists" => file_exists($_FILES["image"]["tmp_name"]),
            "targetPath_writable" => is_writable(dirname($targetPath))
        ]);
        exit();
    }

    // ------------------------
    // Insert Product Into Database
    // ------------------------
    try {
        $stmt = $conn->prepare(
            "INSERT INTO products (name, description, price, stock, image) 
            VALUES (?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $_POST['name'],
            $_POST['description'] ?? '',
            $_POST['price'],
            $_POST['stock'] ?? 0,
            $imageName
        ]);

        http_response_code(200);
        echo json_encode(["message" => "Product created successfully", "image" => $imageName]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => $e->getMessage()]);
    }
?>