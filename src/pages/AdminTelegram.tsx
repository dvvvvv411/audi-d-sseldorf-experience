import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Send, Loader2 } from "lucide-react";

interface TelegramChat {
  id: string;
  chat_id: string;
  label: string | null;
  created_at: string;
}

const AdminTelegram = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const fetchChats = async () => {
    const { data } = await supabase
      .from("telegram_chat_ids")
      .select("*")
      .order("created_at", { ascending: false });
    setChats(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchChats(); }, []);

  const handleAdd = async () => {
    if (!chatId.trim()) return;
    setAdding(true);
    const { error } = await supabase
      .from("telegram_chat_ids")
      .insert({ chat_id: chatId.trim(), label: label.trim() || null });
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Chat-ID hinzugefügt" });
      setChatId("");
      setLabel("");
      fetchChats();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("telegram_chat_ids").delete().eq("id", id);
    toast({ title: "Chat-ID gelöscht" });
    fetchChats();
  };

  const handleTest = async (chat: TelegramChat) => {
    setTestingId(chat.id);
    try {
      const { error } = await supabase.functions.invoke("send-telegram-test", {
        body: {
          chat_id: chat.chat_id,
          message: "✅ Testnachricht von deinem Audi Admin-Panel!\n\nDie Verbindung funktioniert.",
        },
      });
      if (error) throw error;
      toast({ title: "Testnachricht gesendet", description: `An ${chat.chat_id}` });
    } catch (err: any) {
      toast({ title: "Fehler", description: err.message ?? "Senden fehlgeschlagen", variant: "destructive" });
    }
    setTestingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neue Chat-ID hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-gray-700">Chat-ID *</label>
              <Input
                placeholder="z.B. 123456789"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-gray-700">Label (optional)</label>
              <Input
                placeholder="z.B. Max Handy"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} disabled={adding || !chatId.trim()}>
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Hinzufügen
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Um deine Chat-ID zu erfahren, sende <code>/start</code> an deinen Bot und dann <code>/start</code> an <a href="https://t.me/userinfobot" target="_blank" rel="noopener" className="underline">@userinfobot</a>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gespeicherte Chat-IDs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : chats.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Noch keine Chat-IDs gespeichert.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chat-ID</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Hinzugefügt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chats.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell className="font-mono">{chat.chat_id}</TableCell>
                    <TableCell>{chat.label ?? "–"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(chat.created_at).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(chat)}
                        disabled={testingId === chat.id}
                      >
                        {testingId === chat.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(chat.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTelegram;
