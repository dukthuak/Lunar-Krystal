module.exports.config = {
    name: "togglepermission",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Lunar-Krystal",
    description: "Bật/tắt hệ thống kiểm tra quyền sử dụng bot",
    commandCategory: "Admin",
    usages: "[on/off]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, getText }) {
    const { threadID, messageID, senderID } = event;
    
    // Kiểm tra quyền admin bot
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("❌ Chỉ admin bot mới có quyền sử dụng lệnh này!", threadID, messageID);
    }
    
    const action = args[0];
    
    if (action === "on") {
        // Bật kiểm tra quyền
        global.config.permissionCheck = true;
        
        // Lưu vào file config
        const fs = require('fs');
        fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 4));
        
        return api.sendMessage("✅ Đã bật hệ thống kiểm tra quyền!\n🔒 Bây giờ chỉ nhóm được kích hoạt mới sử dụng được bot.", threadID, messageID);
        
    } else if (action === "off") {
        // Tắt kiểm tra quyền
        global.config.permissionCheck = false;
        
        // Lưu vào file config
        const fs = require('fs');
        fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 4));
        
        return api.sendMessage("❌ Đã tắt hệ thống kiểm tra quyền!\n🔓 Bây giờ tất cả mọi người đều có thể sử dụng bot.", threadID, messageID);
        
    } else if (action === "status") {
        // Kiểm tra trạng thái
        const status = global.config.permissionCheck ? "✅ Bật" : "❌ Tắt";
        
        return api.sendMessage(`📊 Trạng thái kiểm tra quyền: ${status}\n\n💡 Sử dụng:\n• /togglepermission on - Bật kiểm tra quyền\n• /togglepermission off - Tắt kiểm tra quyền`, threadID, messageID);
        
    } else {
        return api.sendMessage(`📖 Cách sử dụng:\n• /togglepermission on - Bật kiểm tra quyền\n• /togglepermission off - Tắt kiểm tra quyền\n• /togglepermission status - Xem trạng thái\n\n🔒 Khi bật: Chỉ nhóm được kích hoạt mới sử dụng được bot\n🔓 Khi tắt: Tất cả mọi người đều có thể sử dụng bot`, threadID, messageID);
    }
};
