"use client";

export function SiteHeader() {
  return (
    <header
      className="
        flex
        h-(--header-height)
        shrink-0
        items-center
        border-b
        border-[#27272A]
        bg-[#111113]/95
        backdrop-blur
        supports-[backdrop-filter]:bg-[#111113]/60
        px-4
        lg:px-6
      "
    >
      {/* Since the sidebar is no longer collapsible, we remove the trigger.
        You can replace this space with a Breadcrumb or Room Name.
      */}
      <div className="text-sm font-medium text-zinc-400">
        Workspace Dashboard
      </div>
    </header>
  );
}