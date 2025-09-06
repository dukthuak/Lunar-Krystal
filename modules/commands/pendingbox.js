module.exports.config = {
    name: "pendingbox",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Lunar-Krystal",
    description: "Xem danh sách nhóm chưa kích hoạt bot",
    commandCategory: "Admin",
    usages: "[page]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, getText, Threads }) {
    const { threadID, messageID, senderID } = event;
    
    // Kiểm tra quyền admin bot
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("❌ Chỉ admin bot mới có quyền sử dụng lệnh này!", threadID, messageID);
    }
    
    const page = parseInt(args[0]) || 1;
    const itemsPerPage = 10;
    
    try {
        // Lấy danh sách tất cả nhóm
        const allThreads = await Threads.getAll();
        const pendingThreads = allThreads.filter(thread => 
            !thread.data || 
            thread.data.activated !== true || 
            thread.data.banned === true
        );
        
        const totalPages = Math.ceil(pendingThreads.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const threadsOnPage = pendingThreads.slice(startIndex, endIndex);
        
        let message = `📋 DANH SÁCH NHÓM CHƯA KÍCH HOẠT BOT\n`;
        message += `📊 Trang ${page}/${totalPages} | Tổng: ${pendingThreads.length} nhóm\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        if (threadsOnPage.length === 0) {
            message += `✅ Tất cả nhóm đã được kích hoạt!`;
        } else {
            for (let i = 0; i < threadsOnPage.length; i++) {
                const thread = threadsOnPage[i];
                const threadData = thread.data || {};
                const threadInfo = thread.threadInfo || {};
                
                message += `${startIndex + i + 1}. ${threadInfo.threadName || "Không có tên"}\n`;
                message += `   🆔 ID: ${thread.threadID}\n`;
                
                if (threadData.banned === true) {
                    message += `   🚫 Trạng thái: Bị cấm\n`;
                    message += `   📝 Lý do: ${threadData.banReason || "Không có lý do"}\n`;
                    if (threadData.bannedBy) {
                        message += `   👤 Cấm bởi: ${global.data.userName.get(threadData.bannedBy) || threadData.bannedBy}\n`;
                    }
                } else {
                    message += `   ⏳ Trạng thái: Chưa kích hoạt\n`;
                }
                
                message += `\n`;
            }
        }
        
        message += `\n📖 Sử dụng:\n`;
        message += `• /pendingbox [số trang] - Xem trang khác\n`;
        message += `• /activatebox [threadID] - Kích hoạt nhóm\n`;
        message += `• /boxinfo [threadID] - Xem thông tin chi tiết\n`;
        
        return api.sendMessage(message, threadID, messageID);
        
    } catch (error) {
        console.log("Lỗi khi lấy danh sách nhóm chưa kích hoạt:", error);
        return api.sendMessage(`❌ Có lỗi xảy ra khi lấy danh sách nhóm:\n${error.message}`, threadID, messageID);
    }
};
