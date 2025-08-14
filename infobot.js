const os = require("os");
const moment = require("moment");
require("moment-duration-format");

module.exports = async function ({ conn, reply }) {
  try {
    const uptime = moment.duration(process.uptime() * 1000).format("D [days], H [hrs], m [min], s [sec]");
    const platform = os.platform();
    const cpu = os.cpus()[0].model;
    const totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    reply(
`🤖 *Bot Information:*

🔹 *Name:* MegaTron Bot
🧠 *Version:* 1.0.0
🧑‍💻 *Developer:* TAYYAB ❦ ✓
📈 *Uptime:* ${uptime}
💻 *Platform:* ${platform}
⚙️ *CPU:* ${cpu}
💾 *RAM:* ${totalmem} GB

────────────────────
🔔 *Official Channel:* https://www.youtube.com/@demoneye_official
> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`
    );
  } catch (err) {
    console.error("❌ .infobot error:", err);
    reply("❌ Failed to fetch bot info. Try again later.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};