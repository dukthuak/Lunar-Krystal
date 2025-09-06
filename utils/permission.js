/**
 * Kiểm tra quyền sử dụng bot trong nhóm
 * @param {string} threadID - ID của nhóm
 * @returns {Object} - Kết quả kiểm tra quyền
 */
function checkThreadPermission(threadID) {
    // Đã tắt kiểm tra permission - cho phép mọi người sử dụng bot
    return {
        allowed: true,
        reason: "allowed",
        message: "Nhóm được phép sử dụng bot",
        data: null
    };
    
    /*
    try {
        // Kiểm tra xem nhóm có bị cấm không
        if (global.data.threadBanned && global.data.threadBanned.has(threadID)) {
            return {
                allowed: false,
                reason: "banned",
                message: "Nhóm này đã bị cấm sử dụng bot!",
                data: global.data.threadBanned.get(threadID)
            };
        }

        // Kiểm tra dữ liệu nhóm
        const threadData = global.data.threadData.get(threadID);
        
        if (!threadData) {
            return {
                allowed: false,
                reason: "not_activated",
                message: "Nhóm của bạn chưa được kích hoạt sử dụng bot!",
                data: null
            };
        }

        // Kiểm tra xem nhóm có được kích hoạt không
        if (threadData.banned === true) {
            return {
                allowed: false,
                reason: "banned",
                message: `Nhóm này đã bị cấm sử dụng bot!\nLý do: ${threadData.banReason || "Không có lý do"}`,
                data: threadData
            };
        }

        if (threadData.activated !== true) {
            return {
                allowed: false,
                reason: "not_activated",
                message: "Nhóm của bạn chưa được kích hoạt sử dụng bot!",
                data: threadData
            };
        }

        // Nhóm được phép sử dụng bot
        return {
            allowed: true,
            reason: "allowed",
            message: "Nhóm được phép sử dụng bot",
            data: threadData
        };

    } catch (error) {
        console.log("Lỗi khi kiểm tra quyền nhóm:", error);
        return {
            allowed: false,
            reason: "error",
            message: "Có lỗi xảy ra khi kiểm tra quyền!",
            data: null
        };
    }
    */
}

/**
 * Kiểm tra quyền sử dụng lệnh cụ thể
 * @param {string} threadID - ID của nhóm
 * @param {string} commandName - Tên lệnh
 * @param {string} senderID - ID người gửi
 * @returns {Object} - Kết quả kiểm tra quyền
 */
function checkCommandPermission(threadID, commandName, senderID) {
    try {
        // Kiểm tra quyền nhóm trước
        const threadPermission = checkThreadPermission(threadID);
        if (!threadPermission.allowed) {
            return threadPermission;
        }

        // Kiểm tra lệnh có bị cấm trong nhóm không
        const commandBanned = global.data.commandBanned.get(threadID);
        if (commandBanned && commandBanned.includes(commandName)) {
            return {
                allowed: false,
                reason: "command_banned",
                message: `Lệnh "${commandName}" đã bị cấm trong nhóm này!`,
                data: { commandName, threadID }
            };
        }

        // Kiểm tra quyền người dùng
        const command = global.client.commands.get(commandName);
        if (!command) {
            return {
                allowed: false,
                reason: "command_not_found",
                message: "Không tìm thấy lệnh này!",
                data: { commandName }
            };
        }

        const hasPermission = command.config.hasPermssion;
        
        // Quyền 0: Tất cả thành viên
        if (hasPermission === 0) {
            return {
                allowed: true,
                reason: "user_permission",
                message: "Thành viên được phép sử dụng",
                data: { commandName, permission: "user" }
            };
        }

        // Quyền 1: Quản trị viên nhóm
        if (hasPermission === 1) {
            // Kiểm tra xem có phải admin nhóm không (cần API call)
            return {
                allowed: true, // Tạm thời cho phép, sẽ kiểm tra trong command
                reason: "admin_permission",
                message: "Cần quyền quản trị viên nhóm",
                data: { commandName, permission: "admin_group" }
            };
        }

        // Quyền 2: Admin bot
        if (hasPermission === 2) {
            const isAdminBot = global.config.ADMINBOT.includes(senderID);
            if (!isAdminBot) {
                return {
                    allowed: false,
                    reason: "admin_bot_required",
                    message: "Chỉ admin bot mới có quyền sử dụng lệnh này!",
                    data: { commandName, permission: "admin_bot" }
                };
            }
            return {
                allowed: true,
                reason: "admin_bot_permission",
                message: "Admin bot được phép sử dụng",
                data: { commandName, permission: "admin_bot" }
            };
        }

        return {
            allowed: true,
            reason: "default_allowed",
            message: "Được phép sử dụng",
            data: { commandName }
        };

    } catch (error) {
        console.log("Lỗi khi kiểm tra quyền lệnh:", error);
        return {
            allowed: false,
            reason: "error",
            message: "Có lỗi xảy ra khi kiểm tra quyền!",
            data: null
        };
    }
}

/**
 * Tạo thông báo khi nhóm chưa được kích hoạt
 * @param {string} threadID - ID của nhóm
 * @returns {Object} - Thông báo và attachment
 */
function createActivationMessage(threadID) {
    const adminInfo = global.config.ADMINBOT.map((adminID, index) => {
        const adminName = global.data.userName.get(adminID) || `Admin ${index + 1}`;
        return `${index + 1}. ${adminName}\n🔗 Link: https://www.facebook.com/profile.php?id=${adminID}`;
    }).join('\n\n');

    return {
        body: `🤖 **THÔNG BÁO THUÊ BOT**\n\n❌ Nhóm của bạn chưa kích hoạt sử dụng bot!\n\n📞 **Liên hệ Admin để kích hoạt:**\n\n${adminInfo}\n\n💡 **Hướng dẫn:**\n• Sử dụng lệnh \`/callad\` để liên hệ admin\n• Hoặc nhắn tin trực tiếp cho admin\n• Admin sẽ kích hoạt bot cho nhóm của bạn\n\n🤖 **Bot được điều hành bởi:** ${global.config.BOTNAME}`,
        attachment: null
    };
}

module.exports = {
    checkThreadPermission,
    checkCommandPermission,
    createActivationMessage
};
