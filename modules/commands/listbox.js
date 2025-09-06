module.exports.config = {
    name: "listbox",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Lunar-Krystal",
    description: "Xem danh sách nhóm đã kích hoạt bot",
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
        const activatedThreads = allThreads.filter(thread => 
            thread.data && thread.data.activated === true && thread.data.banned !== true
        );
        
        const totalPages = Math.ceil(activatedThreads.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const threadsOnPage = activatedThreads.slice(startIndex, endIndex);
        
        let message = `📋 DANH SÁCH NHÓM ĐÃ KÍCH HOẠT BOT\n`;
        message += `📊 Trang ${page}/${totalPages} | Tổng: ${activatedThreads.length} nhóm\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        if (threadsOnPage.length === 0) {
            message += `❌ Không có nhóm nào được kích hoạt`;
        } else {
            for (let i = 0; i < threadsOnPage.length; i++) {
                const thread = threadsOnPage[i];
                const threadData = thread.data || {};
                const threadInfo = thread.threadInfo || {};
                
                message += `${startIndex + i + 1}. ${threadInfo.threadName || "Không có tên"}\n`;
                message += `   🆔 ID: ${thread.threadID}\n`;
                message += `   👤 Kích hoạt bởi: ${global.data.userName.get(threadData.activatedBy) || "Unknown"}\n`;
                message += `   ⏰ Thời gian: ${threadData.activatedAt ? new Date(threadData.activatedAt).toLocaleString("vi-VN") : "Unknown"}\n\n`;
            }
        }
        
        message += `\n📖 Sử dụng: /listbox [số trang] để xem trang khác`;
        
        return api.sendMessage(message, threadID, messageID);
        
    } catch (error) {
        console.log("Lỗi khi lấy danh sách nhóm:", error);
        return api.sendMessage(`❌ Có lỗi xảy ra khi lấy danh sách nhóm:\n${error.message}`, threadID, messageID);
    }
};