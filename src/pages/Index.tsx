import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Activity, 
  MessageCircle, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Users, 
  Download, 
  Trash2, 
  Send,
  Circle,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Mock data for the dashboard
const mockMessages = [
  { id: 1, user: "Alice", text: "CPU usage spiking on prod server", time: "14:32", avatar: "A" },
  { id: 2, user: "Bob", text: "Investigating the memory leak", time: "14:35", avatar: "B" },
  { id: 3, user: "Charlie", text: "Database queries are optimized now", time: "14:38", avatar: "C" },
];

const mockCpuData = Array.from({ length: 20 }, (_, i) => ({
  time: `${14 + Math.floor(i / 4)}:${String((i % 4) * 15).padStart(2, '0')}`,
  cpu: 45 + Math.random() * 40,
}));

const Index = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [cpuData, setCpuData] = useState(mockCpuData);
  const [currentCpu, setCurrentCpu] = useState(65);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate real-time CPU updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpuValue = Math.max(20, Math.min(95, currentCpu + (Math.random() - 0.5) * 20));
      setCurrentCpu(newCpuValue);
      
      setCpuData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
          cpu: newCpuValue
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentCpu]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        avatar: "Y"
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const getCpuStatus = (cpu: number) => {
    if (cpu < 50) return { color: "success", icon: CheckCircle };
    if (cpu < 80) return { color: "warning", icon: AlertTriangle };
    return { color: "error", icon: AlertTriangle };
  };

  const cpuStatus = getCpuStatus(currentCpu);
  const StatusIcon = cpuStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-dashboard p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary animate-pulse-slow" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DevOps Dashboard
              </h1>
            </div>
            <Badge variant={connectionStatus === "connected" ? "default" : "destructive"} className="animate-glow">
              <Circle className={`h-2 w-2 mr-1 ${connectionStatus === "connected" ? "fill-success" : "fill-destructive"}`} />
              {connectionStatus === "connected" ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMessages([])}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] bg-gradient-card backdrop-blur-glass border-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Team Chat
                <Badge variant="secondary" className="ml-auto">
                  {messages.length} messages
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3 animate-fade-in-up">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {message.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.user}</span>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-muted/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-background/50"
                  />
                  <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* CPU Usage Chart */}
          <Card className="bg-gradient-card backdrop-blur-glass border-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-accent" />
                  CPU Usage
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 text-${cpuStatus.color}`} />
                  <span className={`text-sm font-mono text-${cpuStatus.color}`}>
                    {currentCpu.toFixed(1)}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cpu"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      className="animate-data-stream"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <Progress value={currentCpu} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* System Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card backdrop-blur-glass border-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Memory</p>
                    <p className="text-2xl font-bold text-warning">74.2%</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-warning" />
                </div>
                <Progress value={74.2} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-glass border-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disk I/O</p>
                    <p className="text-2xl font-bold text-success">23.1%</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-success" />
                </div>
                <Progress value={23.1} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-glass border-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Network</p>
                    <p className="text-2xl font-bold text-accent">156 MB/s</p>
                  </div>
                  <Wifi className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  ↑ 89 MB/s ↓ 67 MB/s
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-lg font-semibold text-primary flex items-center justify-center gap-1">
            <Users className="h-4 w-4" />
            {messages.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Uptime</p>
          <p className="text-lg font-semibold text-success">99.94%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Messages Today</p>
          <p className="text-lg font-semibold text-accent">{messages.length * 47}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Data Exported</p>
          <p className="text-lg font-semibold text-warning">2.3 GB</p>
        </div>
      </div>
    </div>
  );
};

export default Index;