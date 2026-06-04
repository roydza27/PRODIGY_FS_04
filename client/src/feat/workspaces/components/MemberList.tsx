import { useGetWorkspaceMembers } from "../api/workspace.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface MemberListProps {
  workspaceId: string;
}

export const MemberList = ({ workspaceId }: MemberListProps) => {
  const { data: members, isLoading, error } = useGetWorkspaceMembers(workspaceId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">Failed to load members.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Members ({members?.length || 0})
      </h3>
      <div className="grid gap-4">
        {members?.map((membership) => (
          <div key={membership._id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={membership.user?.avatarUrl} alt={membership.user?.name} />
                <AvatarFallback>
                  {membership.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {membership.user?.name || membership.nickname}
                  </p>
                  <Badge variant={membership.role === "owner" ? "default" : "secondary"}>
                    {membership.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">@{membership.user?.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
