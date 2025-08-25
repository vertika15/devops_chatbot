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
  { id: 1, user: "Alice", text: "🚨 Production server web-01 showing 89% CPU usage", time: "14:32", avatar: "A" },
  { id: 2, user: "DevOps AI", text: "Alert triggered: CPU > 80% for 5min. Current: 89.2% | Load: 4.3 | Memory: 74.1% | Processes: docker(45%), nginx(22%), postgres(18%)", time: "14:33", avatar: "AI" },
  { id: 3, user: "Bob", text: "Checking memory leak in payment service container", time: "14:35", avatar: "B" },
  { id: 4, user: "DevOps AI", text: "Memory analysis: payment-service heap 2.1GB (+47% in 2h) | GC cycles: 847/min | Suspected leak in Redis connection pool", time: "14:36", avatar: "AI" },
  { id: 5, user: "Charlie", text: "Applied database index optimization", time: "14:38", avatar: "C" },
  { id: 6, user: "DevOps AI", text: "DB performance improved: Avg query time 89ms→34ms (-62%) | Active connections: 23/100 | Cache hit ratio: 94.2%", time: "14:39", avatar: "AI" },
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

  const generateDataDrivenResponse = () => {
    const responses = [
      `System analysis: CPU ${currentCpu.toFixed(1)}% | Memory 74.2% | Load avg: ${(Math.random() * 3 + 1).toFixed(1)} | Active processes: ${Math.floor(Math.random() * 50 + 120)}`,
      `Alert resolved: Response time improved to ${Math.floor(Math.random() * 100 + 50)}ms (-${Math.floor(Math.random() * 40 + 20)}%) | Error rate: 0.${Math.floor(Math.random() * 9 + 1)}%`,
      `Database metrics: Active connections ${Math.floor(Math.random() * 20 + 15)}/100 | Query time: ${Math.floor(Math.random() * 50 + 20)}ms | Cache hit: ${Math.floor(Math.random() * 10 + 90)}%`,
      `Container status: docker-compose up | ${Math.floor(Math.random() * 5 + 8)} services running | Memory usage: ${Math.floor(Math.random() * 20 + 60)}% | Disk I/O: ${Math.floor(Math.random() * 30 + 10)}%`,
      `Network analysis: Throughput ${Math.floor(Math.random() * 100 + 80)}MB/s | Latency: ${Math.floor(Math.random() * 10 + 5)}ms | Packet loss: 0.0${Math.floor(Math.random() * 9)}%`,
      `Security scan: ${Math.floor(Math.random() * 1000 + 500)} packages checked | ${Math.floor(Math.random() * 3)} vulnerabilities found | Last backup: ${Math.floor(Math.random() * 4 + 1)}h ago`,
      `Scaling event: Auto-scaled to ${Math.floor(Math.random() * 3 + 3)} instances | Load balanced across ${Math.floor(Math.random() * 2 + 2)} zones | Target CPU: 70%`,
      `Log analysis: ${Math.floor(Math.random() * 50 + 20)}K entries processed | ${Math.floor(Math.random() * 5)} warnings | ${Math.floor(Math.random() * 2)} errors | Pattern: normal`,
      `Deployment status: Build #${Math.floor(Math.random() * 100 + 200)} successful | Tests passed: ${Math.floor(Math.random() * 20 + 180)}/200 | Deploy time: ${Math.floor(Math.random() * 60 + 120)}s`,
      `Performance boost: CDN cache hit ${Math.floor(Math.random() * 10 + 85)}% | GZIP enabled | Images optimized | Page load: ${Math.floor(Math.random() * 500 + 800)}ms`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        user: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        avatar: "Y"
      };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");

      // AI Assistant response after 1-2 seconds
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          user: "DevOps AI",
          text: generateDataDrivenResponse(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          avatar: "AI"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000 + Math.random() * 1000);
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