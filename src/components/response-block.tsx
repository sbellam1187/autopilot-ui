import { useChatContext, ResponseBlockType } from "@/providers/ChatProvider";
export default function ResponseBlock({
  message,
}: {
  message: ResponseBlockType;
}) {
  const { responseMessage, setResponseMessage } = useChatContext();

  return (
    <div
      className={`${responseMessage && message.id === responseMessage.id ? "border-primary" : "border-secondary"} border-2 rounded-2xl p-10 hover:cursor-pointer`}
      onClick={() => setResponseMessage(message)}
    >
      <div>
        <span>{message.title}</span>
        <p className="text-sm text-gray-400">{message.type}</p>
      </div>
    </div>
  );
}
