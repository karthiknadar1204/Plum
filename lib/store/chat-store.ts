import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Chat {
  id: string
  title: string
  messages: any[]
  createdAt: Date
}

interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
  addChat: (chat: Chat) => void
  updateChat: (id: string, chat: Partial<Chat>) => void
  deleteChat: (id: string) => void
  setCurrentChat: (id: string) => void
  getCurrentChat: () => Chat | undefined
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      addChat: (chat) => set((state) => ({ 
        chats: [...state.chats, chat],
        currentChatId: chat.id 
      })),
      updateChat: (id, updatedChat) => set((state) => ({
        chats: state.chats.map((chat) => 
          chat.id === id ? { ...chat, ...updatedChat } : chat
        )
      })),
      deleteChat: (id) => set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== id),
        currentChatId: state.currentChatId === id ? null : state.currentChatId
      })),
      setCurrentChat: (id) => set({ currentChatId: id }),
      getCurrentChat: () => {
        const { chats, currentChatId } = get()
        return chats.find((chat) => chat.id === currentChatId)
      }
    }),
    {
      name: 'chat-store'
    }
  )
)
