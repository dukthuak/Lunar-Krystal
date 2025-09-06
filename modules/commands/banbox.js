module.exports.config = {
    name: "banbox",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Lunar-Krystal",
    description: "Cấm nhóm sử dụng bot",
    commandCategory: "Admin",
    usages: "[threadID] [lý do] hoặc [reply tin nhắn] [lý do]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, getText, Threads }) {
    const { threadID, messageID, senderID, messageReply } = event;
    
    // Kiểm tra quyền admin bot
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("❌ Chỉ admin bot mới có quyền sử dụng lệnh này!", threadID, messageID);
    }
    
    let targetThreadID = threadID;
    let reason = "Không có lý do";
    
    // Nếu có reply tin nhắn, lấy threadID từ tin nhắn được reply
    if (messageReply) {
        targetThreadID = messageReply.threadID;
        reason = args.join(" ") || "Không có lý do";
    } else if (args[0]) {
        targetThreadID = args[0];
        reason = args.slice(1).join(" ") || "Không có lý do";
    }
    
    try {
        // Kiểm tra xem nhóm có tồn tại không
        const threadInfo = await api.getThreadInfo(targetThreadID);
        
        if (!threadInfo) {
            return api.sendMessage("❌ Không tìm thấy nhóm với ID này!", threadID, messageID);
        }
        
        // Cập nhật dữ liệu nhóm - cấm sử dụng
        await Threads.setData(targetThreadID, { 
            threadInfo: threadInfo,
            data: {
                activated: false,
                banned: true,
                bannedBy: senderID,
                bannedAt: new Date().toISOString(),
                banReason: reason
            }
        });
        
        // Thêm vào danh sách nhóm bị cấm
        global.data.threadBanned.set(targetThreadID, {
            reason: reason,
            dateAdded: new Date().toISOString(),
            bannedBy: senderID
        });
        
        // Cập nhật threadData
        global.data.threadData.set(targetThreadID, {
            activated: false,
            banned: true,
            bannedBy: senderID,
            bannedAt: new Date().toISOString(),
            banReason: reason
        });
        
        // Gửi thông báo đến nhóm bị cấm
        try {
            await api.sendMessage({
                body: `⚠️ Nhóm "${threadInfo.threadName}" đã bị cấm sử dụng bot!\n\n❌ Lý do: ${reason}\n👤 Cấm bởi: ${global.data.userName.get(senderID) || "Admin"}\n⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}\n\n📞 Liên hệ admin để được hỗ trợ: /callad`,
                mentions: [{
                    id: senderID,
                    tag: global.data.userName.get(senderID) || "Admin"
                }]
            }, targetThreadID);
        } catch (e) {
            console.log("Không thể gửi thông báo đến nhóm:", e.message);
        }
        
        return api.sendMessage(`✅ Đã cấm thành công nhóm:\n📝 Tên nhóm: ${threadInfo.threadName}\n🆔 Thread ID: ${targetThreadID}\n❌ Lý do: ${reason}\n👤 Cấm bởi: ${global.data.userName.get(senderID) || "Admin"}\n⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}`, threadID, messageID);
        
    } catch (error) {
        console.log("Lỗi khi cấm nhóm:", error);
        return api.sendMessage(`❌ Có lỗi xảy ra khi cấm nhóm:\n${error.message}`, threadID, messageID);
    }
};
