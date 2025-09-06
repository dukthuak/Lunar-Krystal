module.exports.config = {
    name: "checkstatus",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Lunar-Krystal",
    description: "Kiểm tra trạng thái kích hoạt bot của nhóm",
    commandCategory: "Thành Viên",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, getText }) {
    const { threadID, messageID, senderID } = event;
    
    try {
        // Kiểm tra quyền sử dụng bot trong nhóm
        const permissionCheck = global.utils.permission.checkThreadPermission(threadID);
        
        let message = `📊 **TRẠNG THÁI BOT TRONG NHÓM**\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        if (permissionCheck.allowed) {
            message += `✅ **Trạng thái:** Đã kích hoạt\n`;
            message += `🤖 **Bot:** Hoạt động bình thường\n`;
            message += `👥 **Thành viên:** Có thể sử dụng tất cả lệnh\n\n`;
            
            if (permissionCheck.data) {
                const data = permissionCheck.data;
                if (data.activatedAt) {
                    message += `⏰ **Kích hoạt lúc:** ${new Date(data.activatedAt).toLocaleString("vi-VN")}\n`;
                }
                if (data.activatedBy) {
                    message += `👤 **Kích hoạt bởi:** ${global.data.userName.get(data.activatedBy) || data.activatedBy}\n`;
                }
            }
            
            message += `\n💡 **Hướng dẫn:**\n`;
            message += `• Gõ \`/help\` để xem danh sách lệnh\n`;
            message += `• Gõ \`/menu\` để xem menu chính\n`;
            message += `• Gõ \`/callad\` để liên hệ admin\n`;
            
        } else {
            message += `❌ **Trạng thái:** Chưa kích hoạt\n`;
            message += `🚫 **Lý do:** ${permissionCheck.message}\n\n`;
            
            if (permissionCheck.reason === "not_activated") {
                message += `📞 **Liên hệ Admin để kích hoạt:**\n\n`;
                
                const adminInfo = global.config.ADMINBOT.map((adminID, index) => {
                    const adminName = global.data.userName.get(adminID) || `Admin ${index + 1}`;
                    return `${index + 1}. ${adminName}\n🔗 Link: https://www.facebook.com/profile.php?id=${adminID}`;
                }).join('\n\n');
                
                message += adminInfo;
                message += `\n\n💡 **Hướng dẫn:**\n`;
                message += `• Sử dụng lệnh \`/callad\` để liên hệ admin\n`;
                message += `• Hoặc nhắn tin trực tiếp cho admin\n`;
                message += `• Admin sẽ kích hoạt bot cho nhóm của bạn\n`;
            } else if (permissionCheck.reason === "banned") {
                message += `⚠️ **Nhóm này đã bị cấm sử dụng bot!**\n`;
                if (permissionCheck.data && permissionCheck.data.reason) {
                    message += `📝 **Lý do cấm:** ${permissionCheck.data.reason}\n`;
                }
                message += `\n📞 **Liên hệ admin để được hỗ trợ:**\n`;
                message += `• Sử dụng lệnh \`/callad\` để liên hệ admin\n`;
            }
        }
        
        message += `\n🤖 **Bot được điều hành bởi:** ${global.config.BOTNAME}`;
        
        return api.sendMessage({
            body: message,
            attachment: global.krystal.splice(0, 1)
        }, threadID, messageID);
        
    } catch (error) {
        console.log("Lỗi khi kiểm tra trạng thái:", error);
        return api.sendMessage("❌ Có lỗi xảy ra khi kiểm tra trạng thái!", threadID, messageID);
    }
};
