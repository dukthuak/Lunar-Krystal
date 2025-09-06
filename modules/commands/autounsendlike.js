module.exports.config = {
    name: "autounsendlike",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Lunar-Krystal",
    description: "Bật/tắt tính năng tự động thu hồi tin nhắn khi có like",
    commandCategory: "Admin",
    usages: "[on/off] [thời gian delay (ms)]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, getText }) {
    const { threadID, messageID, senderID } = event;
    
    // Kiểm tra quyền admin
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("❌ Bạn không có quyền sử dụng lệnh này!", threadID, messageID);
    }
    
    const action = args[0];
    const delay = parseInt(args[1]) || 3000;
    
    if (action === "on") {
        // Bật tính năng
        global.config.autounsendlike = {
            autoUnsend: true,
            delayUnsend: delay
        };
        
        // Cập nhật config module
        if (!global.configModule.autounsendlike) {
            global.configModule.autounsendlike = {};
        }
        global.configModule.autounsendlike.autoUnsend = true;
        global.configModule.autounsendlike.delayUnsend = delay;
        
        // Lưu vào file config
        const fs = require('fs');
        fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 4));
        
        return api.sendMessage(`✅ Đã bật tính năng auto unsend like!\n⏱️ Thời gian delay: ${delay}ms`, threadID, messageID);
        
    } else if (action === "off") {
        // Tắt tính năng
        global.config.autounsendlike = {
            autoUnsend: false,
            delayUnsend: delay
        };
        
        // Cập nhật config module
        if (!global.configModule.autounsendlike) {
            global.configModule.autounsendlike = {};
        }
        global.configModule.autounsendlike.autoUnsend = false;
        global.configModule.autounsendlike.delayUnsend = delay;
        
        // Lưu vào file config
        const fs = require('fs');
        fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 4));
        
        return api.sendMessage("❌ Đã tắt tính năng auto unsend like!", threadID, messageID);
        
    } else if (action === "status") {
        // Kiểm tra trạng thái
        const status = global.config.autounsendlike?.autoUnsend ? "✅ Bật" : "❌ Tắt";
        const delayTime = global.config.autounsendlike?.delayUnsend || 3000;
        
        return api.sendMessage(`📊 Trạng thái auto unsend like: ${status}\n⏱️ Thời gian delay: ${delayTime}ms`, threadID, messageID);
        
    } else {
        return api.sendMessage(`📖 Cách sử dụng:\n• ${global.config.PREFIX}autounsendlike on [delay] - Bật tính năng\n• ${global.config.PREFIX}autounsendlike off - Tắt tính năng\n• ${global.config.PREFIX}autounsendlike status - Xem trạng thái\n\nVí dụ: ${global.config.PREFIX}autounsendlike on 5000`, threadID, messageID);
    }
};
