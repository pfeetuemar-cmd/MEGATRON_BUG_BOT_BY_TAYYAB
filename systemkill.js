module.exports = async function ({ conn, m, reply }) {
  try {
    // 🛡 Owner check
    const sender = m.sender?.split("@")[0];
    const ownerList = Array.isArray(global.owner) ? global.owner : [global.owner];
    const cleanOwners = ownerList.map(o => o.toString().replace(/\D/g, ""));

    if (!cleanOwners.includes(sender))
      return reply("🔒 *Only Bot Owner can shut down the bot.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

    // ⚰ Shutdown response
    await reply("⚠️ *SYSTEM SHUTDOWN INITIATED...*\n\n💤 Bot is turning off.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

    // 🛑 Exit process
    process.exit(0);

  } catch (err) {
    console.error("[ERROR] .systemkill:", err);
    return reply("❌ Error while shutting down bot.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};