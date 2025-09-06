module.exports.config = {
    name: "activatebox",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Lunar-Krystal",
    description: "Kích hoạt sử dụng bot cho nhóm",
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
        // Kiểm tra xem nhóm có tồn tại không
        const threadInfo = await api.getThreadInfo(targetThreadID);
        
        if (!threadInfo) {
            return api.sendMessage("❌ Không tìm thấy nhóm với ID này!", threadID, messageID);
        }
        
        // Cập nhật dữ liệu nhóm
        await Threads.setData(targetThreadID, { 
            threadInfo: threadInfo,
            data: {
                activated: true,
                activatedBy: senderID,
                activatedAt: new Date().toISOString(),
                banned: false
            }
        });
        
        // Thêm vào danh sách nhóm được phép
        if (!global.data.allThreadID.includes(targetThreadID)) {
            global.data.allThreadID.push(targetThreadID);
        }
        
        // Cập nhật threadData
        global.data.threadData.set(targetThreadID, {
            activated: true,
            activatedBy: senderID,
            activatedAt: new Date().toISOString(),
            banned: false
        });
        
        // Cập nhật threadInfo
        global.data.threadInfo.set(targetThreadID, threadInfo);
        
        // Gửi thông báo đến nhóm được kích hoạt
        try {
            await api.sendMessage({
                body: `🎉 Chúc mừng! Nhóm "${threadInfo.threadName}" đã được kích hoạt sử dụng bot!\n\n✅ Bây giờ bạn có thể sử dụng tất cả các lệnh của bot\n📖 Gõ /help để xem danh sách lệnh\n🤖 Bot được điều hành bởi: ${global.config.BOTNAME}`,
                mentions: [{
                    id: senderID,
                    tag: global.data.userName.get(senderID) || "Admin"
                }]
            }, targetThreadID);
        } catch (e) {
            console.log("Không thể gửi thông báo đến nhóm:", e.message);
        }
        
        return api.sendMessage(`✅ Đã kích hoạt thành công bot cho nhóm:\n📝 Tên nhóm: ${threadInfo.threadName}\n🆔 Thread ID: ${targetThreadID}\n👤 Kích hoạt bởi: ${global.data.userName.get(senderID) || "Admin"}\n⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}`, threadID, messageID);
        
    } catch (error) {
        console.log("Lỗi khi kích hoạt nhóm:", error);
        return api.sendMessage(`❌ Có lỗi xảy ra khi kích hoạt nhóm:\n${error.message}`, threadID, messageID);
    }
};
