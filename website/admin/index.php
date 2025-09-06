<?php
session_start();
require_once '../config/database.php';

// Simple authentication (in production, use proper authentication)
$is_logged_in = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

if (!$is_logged_in) {
    if (isset($_POST['login'])) {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        // Simple hardcoded credentials (change in production)
        if ($username === 'admin' && $password === 'admin123') {
            $_SESSION['admin_logged_in'] = true;
            $is_logged_in = true;
        } else {
            $login_error = 'Sai tên đăng nhập hoặc mật khẩu';
        }
    }
}

if ($is_logged_in && isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit();
}

$db = new Database();
$contact_requests = $db->getContactRequests();
$active_rentals = $db->getActiveRentals();
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Lunar Krystal Bot</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .login-form {
            max-width: 400px;
            margin: 100px auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        
        .btn {
            background: #6366f1;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        
        .btn:hover {
            background: #5b5bd6;
        }
        
        .btn-danger {
            background: #ef4444;
        }
        
        .btn-danger:hover {
            background: #dc2626;
        }
        
        .btn-success {
            background: #10b981;
        }
        
        .btn-success:hover {
            background: #059669;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #6366f1;
        }
        
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
        
        .table-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        
        .status {
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #d97706;
        }
        
        .status-contacted {
            background: #dbeafe;
            color: #2563eb;
        }
        
        .status-completed {
            background: #d1fae5;
            color: #059669;
        }
        
        .actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-sm {
            padding: 6px 12px;
            font-size: 12px;
            width: auto;
        }
        
        .error {
            color: #ef4444;
            margin-bottom: 20px;
            padding: 10px;
            background: #fef2f2;
            border-radius: 5px;
        }
        
        .tabs {
            display: flex;
            margin-bottom: 20px;
        }
        
        .tab {
            padding: 10px 20px;
            background: #f8f9fa;
            border: none;
            cursor: pointer;
            border-radius: 5px 5px 0 0;
            margin-right: 5px;
        }
        
        .tab.active {
            background: white;
            border-bottom: 2px solid #6366f1;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body>
    <?php if (!$is_logged_in): ?>
        <div class="login-form">
            <h2 style="text-align: center; margin-bottom: 30px;">
                <i class="fas fa-robot"></i> Admin Login
            </h2>
            
            <?php if (isset($login_error)): ?>
                <div class="error"><?= $login_error ?></div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label for="username">Tên đăng nhập:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Mật khẩu:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" name="login" class="btn">Đăng nhập</button>
            </form>
        </div>
    <?php else: ?>
        <div class="container">
            <div class="header">
                <h1><i class="fas fa-robot"></i> Admin Panel - Lunar Krystal Bot</h1>
                <a href="?logout=1" class="btn btn-danger">Đăng xuất</a>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number"><?= count($contact_requests) ?></div>
                    <div class="stat-label">Tổng yêu cầu</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= count(array_filter($contact_requests, fn($r) => $r['status'] === 'pending')) ?></div>
                    <div class="stat-label">Chờ xử lý</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= count($active_rentals) ?></div>
                    <div class="stat-label">Bot đang hoạt động</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= count(array_filter($contact_requests, fn($r) => $r['status'] === 'completed')) ?></div>
                    <div class="stat-label">Đã hoàn thành</div>
                </div>
            </div>
            
            <div class="tabs">
                <button class="tab active" onclick="showTab('requests')">Yêu cầu thuê bot</button>
                <button class="tab" onclick="showTab('rentals')">Bot đang hoạt động</button>
            </div>
            
            <div id="requests" class="tab-content active">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Gói</th>
                                <th>Thread ID</th>
                                <th>Tin nhắn</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($contact_requests as $request): ?>
                                <tr>
                                    <td><?= $request['id'] ?></td>
                                    <td><?= htmlspecialchars($request['name']) ?></td>
                                    <td><?= ucfirst($request['package']) ?></td>
                                    <td><?= $request['thread_id'] ?: 'N/A' ?></td>
                                    <td><?= htmlspecialchars(substr($request['message'], 0, 50)) ?><?= strlen($request['message']) > 50 ? '...' : '' ?></td>
                                    <td>
                                        <span class="status status-<?= $request['status'] ?>">
                                            <?= ucfirst($request['status']) ?>
                                        </span>
                                    </td>
                                    <td><?= date('d/m/Y H:i', strtotime($request['created_at'])) ?></td>
                                    <td class="actions">
                                        <?php if ($request['status'] === 'pending'): ?>
                                            <button class="btn btn-success btn-sm" onclick="updateStatus(<?= $request['id'] ?>, 'contacted')">
                                                Đã liên hệ
                                            </button>
                                        <?php endif; ?>
                                        
                                        <?php if ($request['status'] === 'contacted'): ?>
                                            <button class="btn btn-success btn-sm" onclick="updateStatus(<?= $request['id'] ?>, 'completed')">
                                                Hoàn thành
                                            </button>
                                        <?php endif; ?>
                                        
                                        <button class="btn btn-sm" onclick="viewDetails(<?= $request['id'] ?>)">
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div id="rentals" class="tab-content">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên người dùng</th>
                                <th>Thread ID</th>
                                <th>Gói</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($active_rentals as $rental): ?>
                                <tr>
                                    <td><?= $rental['id'] ?></td>
                                    <td><?= htmlspecialchars($rental['user_name']) ?></td>
                                    <td><?= $rental['thread_id'] ?></td>
                                    <td><?= ucfirst($rental['package']) ?></td>
                                    <td><?= date('d/m/Y', strtotime($rental['start_date'])) ?></td>
                                    <td><?= $rental['end_date'] ? date('d/m/Y', strtotime($rental['end_date'])) : 'Không giới hạn' ?></td>
                                    <td>
                                        <span class="status status-<?= $rental['status'] ?>">
                                            <?= ucfirst($rental['status']) ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <script>
            function showTab(tabName) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab content
                document.getElementById(tabName).classList.add('active');
                
                // Add active class to clicked tab
                event.target.classList.add('active');
            }
            
            function updateStatus(id, status) {
                if (confirm('Bạn có chắc chắn muốn cập nhật trạng thái?')) {
                    fetch('update_status.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: id,
                            status: status
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            location.reload();
                        } else {
                            alert('Có lỗi xảy ra: ' + data.error);
                        }
                    })
                    .catch(error => {
                        alert('Có lỗi xảy ra: ' + error);
                    });
                }
            }
            
            function viewDetails(id) {
                // Implement view details functionality
                alert('Chi tiết yêu cầu ID: ' + id);
            }
        </script>
    <?php endif; ?>
</body>
</html>
