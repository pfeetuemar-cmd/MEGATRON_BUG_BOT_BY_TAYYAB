module.exports = async function ({ args, reply }) {
  if (!args[0]) return reply("📜 Use: .readmore your | hidden text");

  const fullText = args.join(" ");
  const [visible, hidden] = fullText.split("|");

  if (!hidden) return reply("🧾 Use `|` to separate visible & hidden part.\nExample:\n.readmore Hello | This is hidden!");

  const readmore = String.fromCharCode(8206).repeat(4001); // invisible chars
  const result = `${visible.trim()}${readmore}${hidden.trim()}`;

  return reply(result);
};