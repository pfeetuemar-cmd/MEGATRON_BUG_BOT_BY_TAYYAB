module.exports = async function ({ reply }) {
  const format = (seconds) => {
    const pad = (s) => (s < 10 ? "0" + s : s);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
  };

  const uptime = process.uptime();
  const formatted = format(uptime);

  reply(
`╭━〔 🔋 *Runtime Report* 〕━╮
┃ 🤖 *Bot:* MeGaTron ⚡
┃ ⏱️ *Uptime:* ${formatted}
┃ 📺 *YT:* https://www.youtube.com/@demoneye_official
╰━━━〔 > 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓ 〕━━━╯`
  );
};