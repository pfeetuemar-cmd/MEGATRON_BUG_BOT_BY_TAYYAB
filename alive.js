const os = require("os");
const moment = require("moment-timezone");

module.exports = async function ({ reply }) {
  const uptimeSeconds = process.uptime();
  const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);

  const status = `
╭─「 🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 」
│
│ 🧠 *Status*: _Online_
│ 💡 *Uptime*: _${uptime}_
│ 🛡 *Host*: _${os.hostname()}_
│ 🌍 *Region*: _${Intl.DateTimeFormat().resolvedOptions().timeZone}_
│ 🕰 *Time*: _${moment().format("hh:mm:ss A")}_
│ 🔋 *Power*: _Stable_
│
╰─「 𝗠𝗘𝗚𝗔𝗧𝗥𝗢𝗡 𝗔𝗜 」
> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓
`;

  reply(status);
};