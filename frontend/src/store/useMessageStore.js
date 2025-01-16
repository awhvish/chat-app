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
            const res = await axiosInstance.get("/api/message/users");
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
        try {
            const res = await axiosInstance.get("/api/messages/message");
            set ({message: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error getting message: " + error);
        } finally {
            set({isMessagesLoading: false});
        }
    },

}));