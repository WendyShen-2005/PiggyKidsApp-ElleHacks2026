import React, { useState, useEffect, useMemo } from 'react';
import { 
  PiggyBank, 
  User, 
  Baby, 
  TrendingUp, 
  CheckSquare, 
  PlusCircle, 
  FileText, 
  ArrowRight, 
  Upload,
  MessageCircle,
  X,
  Send,
  PieChart,
  LayoutDashboard
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_TASKS = [
  { id: 1, title: 'Clean the Room', amount: 5, completed: false },
  { id: 2, title: 'Wash the Dishes', amount: 3, completed: true },
  { id: 3, title: 'Feed the Dog', amount: 2, completed: false },
];

const INITIAL_EXPENSES = [
  { id: 1, category: 'Toys', amount: 15 },
  { id: 2, category: 'Candy', amount: 2 },
  { id: 3, category: 'Snack', amount: 5 },
];

export default function LoginPage() {
    const [view, setView] = useState('login'); // login, kids_home, kids_tasks, parent_dashboard
    const [loginType, setLoginType] = useState('parent'); // parent or kids
    const [balance, setBalance] = useState(125.50);
    const [showPigChat, setShowPigChat] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'pig', text: 'Oink! I am your smart piggy bank. How can I help you save today?' }
    ]);

    // Handlers
    const handleLogin = () => {
        setView(loginType === 'parent' ? 'parent_dashboard' : 'kids_home');
    };

    const addMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
    
        const newMsgs = [...messages, { role: 'user', text: chatInput }];
        setMessages(newMsgs);
        setChatInput('');

        // Simulate Gemini API response logic
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'pig',
                text: "That sounds like a great plan! Remember, if you save your candy money for 2 more weeks, you can buy that LEGO set!"
            }]);
        }, 1000);
    };

    // --- Login Screen ---
    if (view === 'login') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-2 border-blue-100">
                    <div className="text-center mb-8">
                        <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-pink-200">
                            <PiggyBank size={40} className="text-pink-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">Piggy Finance</h1>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setLoginType('parent')}
                            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${loginType === 'parent' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            <User size={18} className="mr-2" /> Parent
                        </button>
                        <button
                            onClick={() => setLoginType('kids')}
                            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${loginType === 'kids' ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                        >
                            <Baby size={18} className="mr-2" /> Kids
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1 uppercase tracking-wider">Username</label>
                            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Enter username..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1 uppercase tracking-wider">Password</label>
                            <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" placeholder="••••••••" />
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center"
                        >
                            LOGIN <ArrowRight size={20} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
