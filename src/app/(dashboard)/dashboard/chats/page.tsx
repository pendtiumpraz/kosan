"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { Button, Badge, Input } from "@/components/ui/FormElements";
import { MessageSquare, Search, Send, User } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface ChatParticipant {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
}

interface Chat {
    id: string;
    chatType: string;
    lastMessageAt: string | null;
    participants: ChatParticipant[];
    messages: Message[];
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ChatsPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageText, setMessageText] = useState("");

    // Mock data for demo
    useEffect(() => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setChats([
                {
                    id: "1",
                    chatType: "LISTING",
                    lastMessageAt: new Date().toISOString(),
                    participants: [
                        {
                            id: "p1",
                            user: { id: "u1", name: "Ahmad Rizki", avatar: null },
                        },
                    ],
                    messages: [
                        {
                            id: "m1",
                            content: "Halo, apakah kamar masih tersedia?",
                            senderId: "u1",
                            createdAt: new Date(Date.now() - 3600000).toISOString(),
                        },
                        {
                            id: "m2",
                            content: "Halo, iya masih tersedia. Mau lihat-lihat dulu?",
                            senderId: "me",
                            createdAt: new Date(Date.now() - 3000000).toISOString(),
                        },
                        {
                            id: "m3",
                            content: "Boleh, kapan bisa survey?",
                            senderId: "u1",
                            createdAt: new Date(Date.now() - 1800000).toISOString(),
                        },
                    ],
                },
                {
                    id: "2",
                    chatType: "DIRECT",
                    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
                    participants: [
                        {
                            id: "p2",
                            user: { id: "u2", name: "Sarah Dewi", avatar: null },
                        },
                    ],
                    messages: [
                        {
                            id: "m4",
                            content: "Terima kasih, saya sudah transfer depositnya",
                            senderId: "u2",
                            createdAt: new Date(Date.now() - 86400000).toISOString(),
                        },
                    ],
                },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const formatTime = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        } else if (diffDays === 1) {
            return "Kemarin";
        } else {
            return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        }
    };

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedChat) return;

        // In real app, would send to API
        const newMessage: Message = {
            id: `m${Date.now()}`,
            content: messageText,
            senderId: "me",
            createdAt: new Date().toISOString(),
        };

        setSelectedChat({
            ...selectedChat,
            messages: [...selectedChat.messages, newMessage],
        });
        setMessageText("");
    };

    const filteredChats = chats.filter((chat) =>
        chat.participants.some((p) =>
            p.user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen">
            <Header title="Chat" subtitle="Komunikasi dengan penyewa & pembeli" />

            <div className="p-6">
                <div className="flex h-[calc(100vh-180px)] rounded-xl border bg-white overflow-hidden">
                    {/* Chat List */}
                    <div className="w-80 border-r flex flex-col">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari percakapan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-slate-500">
                                    Memuat...
                                </div>
                            ) : filteredChats.length === 0 ? (
                                <div className="p-4 text-center text-slate-500">
                                    Tidak ada percakapan
                                </div>
                            ) : (
                                filteredChats.map((chat) => {
                                    const otherUser = chat.participants[0]?.user;
                                    const lastMessage = chat.messages[chat.messages.length - 1];
                                    const isSelected = selectedChat?.id === chat.id;

                                    return (
                                        <button
                                            key={chat.id}
                                            onClick={() => setSelectedChat(chat)}
                                            className={`w-full p-4 flex items-start gap-3 text-left border-b transition-colors ${isSelected
                                                    ? "bg-blue-50"
                                                    : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                                                {otherUser?.name.charAt(0) || "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-slate-900 truncate">
                                                        {otherUser?.name || "Unknown"}
                                                    </p>
                                                    <span className="text-xs text-slate-500">
                                                        {lastMessage && formatTime(lastMessage.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {lastMessage?.content || "Belum ada pesan"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                        {selectedChat.participants[0]?.user.name.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {selectedChat.participants[0]?.user.name || "Unknown"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {selectedChat.chatType === "LISTING" ? "Dari Listing" : "Direct"}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {selectedChat.messages.map((msg) => {
                                        const isMe = msg.senderId === "me";
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-slate-100 text-slate-900"
                                                        }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-slate-500"
                                                            }`}
                                                    >
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Tulis pesan..."
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                        <Button onClick={handleSendMessage}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <MessageSquare className="h-16 w-16 mb-4" />
                                <p className="text-lg font-medium">Pilih percakapan</p>
                                <p className="text-sm">Pilih dari daftar di sebelah kiri untuk memulai</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
