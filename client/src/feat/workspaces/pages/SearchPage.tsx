import { useState, useEffect } from "react";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Input } from "@/shared/components/ui/input";
import { Search, Users, Building2, User } from "lucide-react";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useSearchUsers } from "@/feat/users/api/user.queries";
import { useSearchWorkspaces } from "@/feat/workspaces/api/workspace.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

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

  const hasResults = (users && users.length > 0) || (workspaces && workspaces.length > 0);
  const isLoading = usersLoading || workspacesLoading;

  return (
    <PageLayout variant="constrained" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Search
        </h1>
        <p className="text-muted-foreground text-lg">
          Find people and workspaces across RepoSense.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for people or workspaces..."
          className="h-14 pl-12 text-lg rounded-2xl border-white/5 bg-white/[0.03] focus-visible:ring-primary/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {debouncedQuery ? (
        isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : !hasResults ? (
          <EmptyState
            icon={Search}
            title={`No results for "${debouncedQuery}"`}
            description="We couldn't find anything matching your search. Try checking for typos or using different keywords."
          />
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white/5 border border-white/5 p-1 mb-6">
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="users">People ({users?.length || 0})</TabsTrigger>
              <TabsTrigger value="workspaces">Workspaces ({workspaces?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {users && users.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4" /> People
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {users.map(u => <UserCard key={u._id} user={u} />)}
                  </div>
                </section>
              )}

              {workspaces && workspaces.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Workspaces
                  </h3>
                  <div className="grid gap-3">
                    {workspaces.map(w => <WorkspaceCard key={w._id} workspace={w} />)}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="grid gap-3 sm:grid-cols-2">
                {users?.map(u => <UserCard key={u._id} user={u} />)}
              </div>
            </TabsContent>

            <TabsContent value="workspaces">
              <div className="grid gap-3">
                {workspaces?.map(w => <WorkspaceCard key={w._id} workspace={w} />)}
              </div>
            </TabsContent>
          </Tabs>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.05]">
            <Search className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-lg">
            Type something to search for people or workspaces.
          </p>
        </div>
      )}
    </PageLayout>
  );
}

function UserCard({ user }: { user: any }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all">
      <Avatar className="h-12 w-12 rounded-xl">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white truncate">{user.name}</p>
        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
      </div>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: any }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
          <span className="text-lg font-bold text-primary">
            {workspace.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-bold text-white">{workspace.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">{workspace.description || "Public workspace"}</p>
        </div>
      </div>
      <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/5">
        Public
      </Badge>
    </div>
  );
}
