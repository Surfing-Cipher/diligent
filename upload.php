<?php

// Only these origins are allowed to upload images
$accepted_origins = array("http://localhost", "https://www.example.com");

// Set the upload folder
$imageFolder = "uploads/";

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Same-origin requests won't set an origin. If the origin is set, it must be valid.
    if (in_array($_SERVER['HTTP_ORIGIN'], $accepted_origins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
        header("HTTP/1.1 403 Origin Denied");
        return;
    }
}

// Don't attempt to process the upload on an OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    return;
}

// Get the uploaded file
$file = $_FILES['file'];

// Check if the file was uploaded successfully
if (is_uploaded_file($file['tmp_name'])) {
    // Sanitize the file name
    $fileName = preg_replace("/[^A-Za-z0-9\.]/", '', $file['name']);

    // Verify the file extension
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    if (!in_array($fileExtension, array("jpg", "jpeg", "png", "gif"))) {
        header("HTTP/1.1 400 Invalid extension.");
        return;
    }

    // Move the uploaded file to the destination folder
    $destination = $imageFolder . $fileName;
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Respond with JSON containing the path to the uploaded image
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? "https://" : "http://";
        $baseurl = $protocol . $_SERVER["HTTP_HOST"] . rtrim(dirname($_SERVER['REQUEST_URI']), "/");
        $imageUrl = $baseurl . '/' . $destination;
        echo json_encode(array('location' => $imageUrl));
    } else {
        header("HTTP/1.1 500 Server Error");
        return;
    }
} else {
    header("HTTP/1.1 400 Upload failed.");
    return;
}
?>
