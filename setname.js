module.exports = async function ({ conn, m, args, reply }) {
  try {
    // 🧠 Identify sender
    const senderJid = m.key.participant || m.key.remoteJid || "";
    const senderNum = senderJid.replace(/\D/g, "");

    // 📁 Load selfmode.json to check real owner
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(__dirname, "media/selfmode.json");

    let ownerNum = null;
    if (fs.existsSync(configPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(configPath));
        ownerNum = data.owner_sender;
      } catch (err) {
        return reply("❌ selfmode.json file is corrupted!");
      }
    }

    if (!ownerNum) {
      return reply("⚠️ *I'm awaiting my owner's `.self` command to activate bot authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    if (senderNum !== ownerNum) {
      return reply(`🚫 *Oye Nakli Owner!*\n\nSirf *REAL OWNER* hi bot ka name change kar sakta hai.\n\n🔒 Access Denied!\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    // ✅ Set Name
    const name = args.join(" ");
    if (!name) return reply("❌ Name likho!\n\nUsage: `.setname MegaTron Bot`");

    await conn.updateProfileName(name);
    return reply(`✅ Name successfully updated:\n*${name}*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    
  } catch (err) {
    console.error("[ERROR] .setname:", err);
    return reply("❌ Name change karne mein error aaya.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};