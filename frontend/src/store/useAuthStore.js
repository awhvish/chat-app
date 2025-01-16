import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            set({authUser: null});
            console.log("Error in checkAuth: " + error);
        } 
        finally {
            set({isCheckingAuth: false})
        }
    },

    login: async (data) => {
        try{
            set({isSigningUp: true});
            const res = await axiosInstance.post("/auth/signin", data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({isSigningUp: false});
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true});

        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set ({ authUser: res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set ({ isSigningUp: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/signout");
            set ( {authUser: null} );
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    ,
    updateProfile: async ( profilePic ) =>  {
        try {
            set ({isUpdatingProfile: true});
            const res = await axiosInstance.put("/auth/update-profile", profilePic);
            toast.success("Successfully updated profile picture")
            set ({authUser: res.data});
        } catch (error) {
            toast.error(error.response);
            console.log("Error in update-profile: " + error);
        }
        finally {
            set({isUpdatingProfile: false});
        }
    }
}));