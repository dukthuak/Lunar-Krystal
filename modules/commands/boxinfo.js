module.exports.config = {
    name: "boxinfo",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Lunar-Krystal",
    description: "Xem thông tin chi tiết nhóm",
    commandCategory: "Admin",
    usages: "[threadID] hoặc [reply tin nhắn]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, getText, Threads }) {
    const { threadID, messageID, senderID, messageReply } = event;
    
    // Kiểm tra quyền admin bot
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("❌ Chỉ admin bot mới có quyền sử dụng lệnh này!", threadID, messageID);
    }
    
    let targetThreadID = threadID;
    
    // Nếu có reply tin nhắn, lấy threadID từ tin nhắn được reply
    if (messageReply) {
        targetThreadID = messageReply.threadID;
    }
    
    // Nếu có args[0], sử dụng threadID được cung cấp
    if (args[0]) {
        targetThreadID = args[0];
    }
    
    try {
        // Lấy thông tin nhóm từ database
        const threadData = await Threads.getData(targetThreadID);
        const threadInfo = await api.getThreadInfo(targetThreadID);
        
        if (!threadData || !threadInfo) {
            return api.sendMessage("❌ Không tìm thấy thông tin nhóm!", threadID, messageID);
        }
        
        const data = threadData.data || {};
        const info = threadData.threadInfo || threadInfo;
        
        let message = `📋 THÔNG TIN CHI TIẾT NHÓM\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // Thông tin cơ bản
        message += `📝 Tên nhóm: ${info.threadName || "Không có tên"}\n`;
        message += `🆔 Thread ID: ${targetThreadID}\n`;
        message += `👥 Số thành viên: ${info.participants ? info.participants.length : "Unknown"}\n`;
        message += `👑 Số admin: ${info.adminIDs ? info.adminIDs.length : "Unknown"}\n\n`;
        
        // Trạng thái bot
        message += `🤖 TRẠNG THÁI BOT:\n`;
        message += `   ✅ Kích hoạt: ${data.activated ? "Có" : "Không"}\n`;
        message += `   🚫 Bị cấm: ${data.banned ? "Có" : "Không"}\n`;
        
        if (data.activated) {
            message += `   👤 Kích hoạt bởi: ${global.data.userName.get(data.activatedBy) || data.activatedBy || "Unknown"}\n`;
            message += `   ⏰ Thời gian kích hoạt: ${data.activatedAt ? new Date(data.activatedAt).toLocaleString("vi-VN") : "Unknown"}\n`;
        }
        
        if (data.banned) {
            message += `   👤 Cấm bởi: ${global.data.userName.get(data.bannedBy) || data.bannedBy || "Unknown"}\n`;
            message += `   ⏰ Thời gian cấm: ${data.bannedAt ? new Date(data.bannedAt).toLocaleString("vi-VN") : "Unknown"}\n`;
            message += `   📝 Lý do: ${data.banReason || "Không có lý do"}\n`;
        }
        
        message += `\n📊 THỐNG KÊ:\n`;
        message += `   💬 Tổng tin nhắn: ${data.totalMessages || 0}\n`;
        message += `   🎯 Lệnh đã sử dụng: ${data.commandsUsed || 0}\n`;
        message += `   ⏰ Lần cuối hoạt động: ${data.lastActivity ? new Date(data.lastActivity).toLocaleString("vi-VN") : "Chưa có"}\n`;
        
        return api.sendMessage(message, threadID, messageID);
        
    } catch (error) {
        console.log("Lỗi khi lấy thông tin nhóm:", error);
        return api.sendMessage(`❌ Có lỗi xảy ra khi lấy thông tin nhóm:\n${error.message}`, threadID, messageID);
    }
};
