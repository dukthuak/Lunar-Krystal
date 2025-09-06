module.exports.config = {
    name: "autounsendlike",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Lunar-Krystal",
    description: "Tự động thu hồi tin nhắn khi có cảm xúc like",
    commandCategory: "System",
    usages: "",
    cooldowns: 0,
    eventType: ["message_reaction"],
    envConfig: {
        autoUnsend: true,
        delayUnsend: 3000 // 3 giây
    }
};

module.exports.run = async function({ api, event, getText }) {
    const { threadID, messageID, reaction, senderID } = event;
    
    // Kiểm tra xem có phải là cảm xúc like không
    if (reaction !== "👍") return;
    
    // Lấy cấu hình từ global config
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name] || this.config.envConfig;
    
    // Nếu tính năng auto unsend được bật
    if (autoUnsend) {
        // Đợi một khoảng thời gian trước khi thu hồi
        setTimeout(() => {
            api.unsendMessage(messageID, (err) => {
                if (err) {
                    console.log("Lỗi khi thu hồi tin nhắn:", err);
                } else {
                    console.log(`Đã thu hồi tin nhắn ${messageID} sau khi ${senderID} thả like`);
                }
            });
        }, delayUnsend);
    }
};
