import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Input } from "@/shared/components/ui/input";
import { Search, Users, Building2, ChevronRight, ArrowRight, Zap, MessageSquare } from "lucide-react";
import { useSearchUsers } from "@/feat/users/api/user.queries";
import { useSearchWorkspaces } from "@/feat/workspaces/api/workspace.queries";
import { useSearchMessages } from "@/feat/chat/api/chat.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import type { Workspace } from "../types/workspace.types";
import type { AuthUser } from "@/shared/types/auth";
import type { Message } from "@/feat/chat/types/message.types";
import { format } from "date-fns";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: users, isLoading: usersLoading } = useSearchUsers(debouncedQuery);
  const { data: workspaces, isLoading: workspacesLoading } = useSearchWorkspaces(debouncedQuery);
  const { data: messages, isLoading: messagesLoading } = useSearchMessages(debouncedQuery);

  const hasResults = (users && users.length > 0) || 
                     (workspaces && workspaces.length > 0) ||
                     (messages && messages.length > 0);
  const isLoading = usersLoading || workspacesLoading || messagesLoading;

  return (
    <PageLayout variant="constrained" className="relative py-10 flex flex-col gap-10 min-h-full bg-background text-foreground selection:bg-primary/20 text-left">
      
      {/* Premium Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[20%] -left-[5%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary border border-primary/10 w-fit">
          <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
          Discovery
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
          Global Search
        </h1>
        <p className="text-muted-foreground/80 text-[15px] font-normal max-w-xl leading-relaxed">
          Search across the entire network for people, workspaces, and historical messages.
        </p>
      </div>

      <div className="relative z-10 group max-w-4xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search for people, workspaces, or messages..."
          className="h-12 pl-12 pr-12 text-[15px] font-normal rounded-xl border-border/40 bg-card/40 focus-visible:ring-primary/20 focus-visible:bg-card/60 transition-all placeholder:text-muted-foreground/40 shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      <div className="relative z-10 w-full">
        {debouncedQuery ? (
          isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-9 w-48 rounded-xl" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/10 py-24 text-center px-6 max-w-2xl mx-auto">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card border border-border/40 text-muted-foreground/30">
                <Search size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[16px] font-medium tracking-tight text-muted-foreground mb-1">
                No Results Found
              </h3>
              <p className="text-[13.5px] font-normal text-muted-foreground/50 max-w-sm mx-auto leading-relaxed">
                We couldn't find any matches for "{debouncedQuery}". Try refining your keywords or checking for typos.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-card/40 border border-border/40 p-1 mb-8 rounded-xl h-11 w-fit shadow-sm">
                <TabsTrigger value="all" className="rounded-lg px-4 text-[13px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Results</TabsTrigger>
                <TabsTrigger value="users" className="rounded-lg px-4 text-[13px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Engineers ({users?.length || 0})</TabsTrigger>
                <TabsTrigger value="workspaces" className="rounded-lg px-4 text-[13px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Workspaces ({workspaces?.length || 0})</TabsTrigger>
                <TabsTrigger value="messages" className="rounded-lg px-4 text-[13px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Messages ({messages?.length || 0})</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="all" className="space-y-10 focus-visible:outline-none">
                  {users && users.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2 px-1">
                        <Users className="h-4 w-4 text-muted-foreground/40" /> Engineers discovered
                      </h3>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {users.map(u => <UserCard key={u._id} user={u} />)}
                      </div>
                    </motion.section>
                  )}

                  {workspaces && workspaces.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2 px-1">
                        <Building2 className="h-4 w-4 text-muted-foreground/40" /> Workspaces discovered
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {workspaces.map(w => <WorkspaceCard key={w._id} workspace={w} />)}
                      </div>
                    </motion.section>
                  )}

                  {messages && messages.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2 px-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground/40" /> Messages found
                      </h3>
                      <div className="grid gap-4">
                        {messages.map(m => <MessageResultCard key={m._id} message={m} />)}
                      </div>
                    </motion.section>
                  )}
                </TabsContent>

                <TabsContent value="users" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 focus-visible:outline-none">
                  {users?.map(u => <UserCard key={u._id} user={u} />)}
                </TabsContent>

                <TabsContent value="workspaces" className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 focus-visible:outline-none">
                  {workspaces?.map(w => <WorkspaceCard key={w._id} workspace={w} />)}
                </TabsContent>

                <TabsContent value="messages" className="grid gap-4 focus-visible:outline-none">
                  {messages?.map(m => <MessageResultCard key={m._id} message={m} />)}
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center group max-w-2xl mx-auto">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-card border border-border/40 text-muted-foreground/30 group-hover:text-primary/50 transition-all duration-300">
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium tracking-tight text-muted-foreground mb-1">
              Awaiting Input
            </h3>
            <p className="text-[13.5px] font-normal text-muted-foreground/50 max-w-sm leading-relaxed">
              Initialize a search query to discover engineers, workspaces, and messages across the layout grid.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <mark key={i} className="bg-primary/30 text-primary-foreground rounded-sm px-0.5">{part}</mark> 
          : part
      )}
    </>
  );
}

function UserCard({ user }: { user: Partial<AuthUser> & { _id: string } }) {
  const navigate = useNavigate();
  const fallbackInitial = user.name?.charAt(0)?.toUpperCase() ?? "?";
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/dm/${user._id}`)} // This might need a real conversation lookup, but for now we'll assume the DM creation logic handles it
      className="flex items-center gap-4 rounded-xl border border-border/30 bg-card/40 p-4 hover:bg-card/70 hover:border-border/50 transition-all group shadow-sm cursor-pointer"
    >
      <Avatar className="h-11 w-11 rounded-full border border-border/10 bg-muted/50 shrink-0">
        <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
        <AvatarFallback className="rounded-full bg-primary/10 text-primary font-medium text-base">
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-medium text-foreground/90 group-hover:text-primary transition-colors truncate">{user.name}</p>
        <p className="text-[12.5px] font-normal text-muted-foreground/60 truncate">@{user.username || "user"}</p>
      </div>
      <div className="h-8 w-8 rounded-full border border-border/20 flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:border-primary/30 transition-all shrink-0">
        <ChevronRight size={16} strokeWidth={2.5} />
      </div>
    </motion.div>
  );
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/w/${workspace.slug}`)}
      className="group flex flex-col justify-between items-start rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:bg-card/60 hover:border-border/60 active:scale-[0.99] shadow-sm min-h-[140px] cursor-pointer"
    >
      <div className="flex items-start gap-4 min-w-0 w-full">
        <div className="h-11 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 font-medium text-lg text-primary shrink-0">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15.5px] font-medium text-foreground/90 group-hover:text-primary transition-colors truncate">
            {workspace.name}
          </h3>
          <p className="text-[13px] text-muted-foreground/60 line-clamp-2 mt-0.5 whitespace-normal">
            {workspace.description || "Active production architecture workspace linked environment"}
          </p>
        </div>
      </div>
      
      <div className="flex w-full justify-between items-center mt-4 pt-3 border-t border-border/10">
        <span className="text-[12px] font-medium text-primary/70 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md">Verified Node</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </motion.div>
  );
}

function MessageResultCard({ message, query }: { message: Message; query: string }) {
  const navigate = useNavigate();
  const { activeWorkspace } = useActiveWorkspace();

  const handleNavigate = () => {
    if (message.type === "dm") {
      navigate(`/dm/${message.conversationId}`);
    } else {
      navigate(`/w/${activeWorkspace?.slug}/rooms/${message.roomId}`);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -1 }}
      onClick={handleNavigate}
      className="group flex items-start gap-4 rounded-xl border border-border/30 bg-card/40 p-4 hover:bg-card/70 hover:border-border/50 transition-all shadow-sm cursor-pointer"
    >
      <Avatar className="h-9 w-9 rounded-full border border-border/10 shrink-0">
        <AvatarImage src={message.senderId.avatarUrl} alt={message.senderId.name} className="object-cover" />
        <AvatarFallback className="rounded-full bg-primary/10 text-primary font-medium text-xs">
          {message.senderId.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13.5px] font-black text-foreground/90">{message.senderId.name}</span>
          <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
            {format(new Date(message.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
        <p className="text-[14px] font-medium text-muted-foreground/80 line-clamp-2">
          <HighlightMatch text={message.text} query={query} />
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 bg-primary/5 px-2 py-0.5 rounded">
            {message.type === "dm" ? "Direct Message" : "Channel"}
          </span>
        </div>
      </div>
      <ArrowRight size={14} className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
    </motion.div>
  );
}
