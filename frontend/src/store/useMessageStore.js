import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
            console.error("Error getting users:", error);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            console.log("Fetched messages:", res.data);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
            console.error("Error in getMessages:", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            const newMessages = [...messages, res.data];
            set({ messages: newMessages });
            return res.data;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            
            toast.error("Cannot send message: Internal server error");
            return null;
        }
    },

    setSelectedUser: (selectedUser) => {
        const {toggleShowSidebar} = useAuthStore.getState();
        toggleShowSidebar();
        set({ selectedUser });

    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.error("No socket connection available");
            return;
        }

        // Remove any existing listeners to prevent duplicates
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            console.log(newMessage);
            if (newMessage.senderId !== selectedUser._id) return;

            console.log("Received new message:", newMessage);
            set((state) => ({
                messages: [...state.messages, newMessage]
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    }
}));