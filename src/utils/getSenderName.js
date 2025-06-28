
export default function getSenderName(message) {
  if (message.isYou) {
    return "You";
  }
  if (message.sender && message.sender.firstName) {
    return message.sender.firstName;
  }
  if (message.sender && message.sender.username) {
    return message.sender.username;
  }
  return "Unknown Sender";
}