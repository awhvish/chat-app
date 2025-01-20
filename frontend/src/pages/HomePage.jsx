import { useMessageStore } from "../store/useMessageStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useMessageStore();

  return (
    <div className="text-xs md:text-sm">
      <div className="flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;