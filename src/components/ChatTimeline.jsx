import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import ChatEvent from "./ChatEvent";
import MessageBubble from "./MessageBubble";

function ChatTimeline({ chatTimelineLoading, chatTimeline, chatEndRef }) {
  return (
    <div className="flex-1 px-4 pb-6 overflow-y-auto">
      {chatTimelineLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner size="lg" color="success" className="block" />
        </div>
      ) : chatTimeline?.messages ? (
        chatTimeline.messages.map((activity, index) => (
          <div key={index} className="space-y-1.5">
            <div className="w-full text-center my-4">
              <Chip className="m-auto">{activity.label}</Chip>
            </div>
            {activity.items.map((item, index) => {
              if (item.contentType !== "message") {
                return <ChatEvent event={item} key={index} />;
              } else {
                return <MessageBubble message={item} key={index} />;
              }
            })}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No messages found.</p>
      )}
      <div ref={chatEndRef}></div>
    </div>
  );
}

export default ChatTimeline;
