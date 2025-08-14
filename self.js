const fs = require('fs');
const path = require('path');

// ✅ Ensure 'media/' folder exists
const mediaFolder = path.join(__dirname, 'media');
if (!fs.existsSync(mediaFolder)) {
  fs.mkdirSync(mediaFolder);
}

const configPath = path.join(mediaFolder, 'selfmode.json');

// ✅ Create config file if it doesn't exist
if (!fs.existsSync(configPath)) {
  console.log("[DEBUG] selfmode.json not found — creating...");
  fs.writeFileSync(configPath, JSON.stringify({ enabled: false, owner_sender: null }, null, 2));
} else {
  console.log("[DEBUG] selfmode.json exists ✅");
}

module.exports = {
  command: ['self', 'public'],
  run: async ({ m, command, conn, reply }) => {
    const botJid = conn.user?.id || '';
    const botNumber = botJid.split(':')[0].replace(/\D/g, '');

    // ✅ Load or initialize config
    const data = JSON.parse(fs.readFileSync(configPath));

    // 🔍 Extract sender info
    const senderJid = m.key?.participant || m.key?.remoteJid || '';
    const senderNum = (senderJid.match(/\d+/g) || [''])[0];

    console.log("📁 [DEBUG] Saved Owner Sender:", data.owner_sender);

    // 👑 First-time save: lock owner_sender permanently
    if (!data.owner_sender) {
      data.owner_sender = senderNum;
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      console.log(`✅ [DEBUG] First-time owner saved: ${senderNum}`);
      return reply(`✅ *Owner auto-set to:* ${senderNum}\n\n🔐 Now Only Owner have Permission to Use Dangerous CMDs.\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    // ❌ Reject if not authorized owner
    if (senderNum !== data.owner_sender) {
      console.log(`❌ [DEBUG] Sender ${senderNum} is NOT authorized owner`);
      return reply("🚫 *Only owner can use .self or .public*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // 🔒 Enable self mode
    if (command === 'self') {
      data.enabled = true;
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      console.log("🔒 Self mode enabled");
      return reply('🔒 *Self mode ON!*\nNow Only Owner can use Dangerous CMDs.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓');
    }

    // 🔓 Enable public mode
    if (command === 'public') {
      data.enabled = false;
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      console.log("🔓Public mode enabled");
      return reply('🔓 *Public mode ON!*\nNow Everyone Have permission to use all CMDs.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓');
    }
  }
};