import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async (userId) => {
        set({isUserLoading: true});
        try  {
            const res = await axiosInstance.get("/message/users");
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error getting user: " + error);
        } finally {
            set({isUserLoading: false});
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        console.log("Getting messages");
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            console.log("messages: " + res.data);
            set ({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in getMessages: " + error);
        } finally {
            set({isMessagesLoading: false});
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.log("Error in sendMessage: " + error);
            toast.error("Cannot send message: Internal server error");
        }
    },
    setSelectedUser: (selectedUser) => {
        set({selectedUser: selectedUser});
    }

}));