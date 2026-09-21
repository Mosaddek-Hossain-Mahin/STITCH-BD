"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, Profile, Address } from "../types";
import { createClient } from "../supabase/client";

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  addresses: Address[];
  isLoading: boolean;
  // Actions
  login: (
    email: string,
    password?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password?: string;
    fullName: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => void;
  switchRole: (role: UserRole) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  syncFromSupabase: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      addresses: [],
      isLoading: false,

      syncFromSupabase: async () => {
        const supabase = createClient();
        if (!supabase) return;

        set({ isLoading: true });
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          set({ isLoading: false });
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const role: UserRole = (profile?.role as UserRole) || "customer";

        set({
          user: {
            id: user.id,
            email: user.email || "",
            full_name:
              profile?.full_name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "",
            role,
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
            created_at: user.created_at,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      login: async (email: string, password?: string) => {
        set({ isLoading: true });
        const supabase = createClient();

        if (supabase && password) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            const role: UserRole = (profile?.role as UserRole) || "customer";

            set({
              user: {
                id: data.user.id,
                email: data.user.email || "",
                full_name:
                  profile?.full_name ||
                  data.user.user_metadata?.full_name ||
                  "",
                role,
                created_at: data.user.created_at,
              },
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
        }

        // Demo fallback
        const role: UserRole = email.includes("admin")
          ? "admin"
          : email.includes("staff")
            ? "staff"
            : "customer";

        const name = email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        set({
          user: {
            id: "demo_" + Date.now(),
            email,
            full_name: name || "Demo User",
            role,
            created_at: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      },

      register: async ({ email, password, fullName, role = "customer" }) => {
        set({ isLoading: true });
        const supabase = createClient();

        if (supabase && password) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email || email,
                full_name: fullName,
                role,
                created_at: data.user.created_at,
              },
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
        }

        // Demo fallback
        set({
          user: {
            id: "demo_" + Date.now(),
            email,
            full_name: fullName,
            role,
            created_at: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      },

      switchRole: (role: UserRole) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }));
      },

      logout: async () => {
        const supabase = createClient();
        if (supabase) {
          await supabase.auth.signOut();
        }
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: "addr_" + Date.now(),
        };
        set((state) => {
          const addresses = addressData.is_default
            ? state.addresses.map((a) => ({ ...a, is_default: false }))
            : state.addresses;
          return { addresses: [...addresses, newAddress] };
        });
      },

      updateAddress: (id, addressData) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...addressData } : a,
          ),
        }));
      },

      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            is_default: a.id === id,
          })),
        }));
      },
    }),
    {
      name: "stitchbd-auth-v2",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        addresses: state.addresses,
      }),
    },
  ),
);
