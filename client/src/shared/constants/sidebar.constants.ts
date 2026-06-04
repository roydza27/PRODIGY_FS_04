import {
  IconHome,
  IconUsers,
  IconUserPlus,
  IconSettings,
  IconBuilding,
  IconUserCircle,
  IconBell,
  IconShield,
} from "@tabler/icons-react";

export const workspaceSidebarData: SidebarData = {
  brandName: "RepoSense",

  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Members",
      url: "/members",
      icon: IconUsers,
    },
    {
      title: "Invites",
      url: "/invites",
      icon: IconUserPlus,
    },
  ],

  documents: [
    {
      name: "Workspace Settings",
      url: "/settings",
      icon: IconBuilding,
    },
  ],

  navSecondary: [
    {
      title: "Notifications",
      url: "/notifications",
      icon: IconBell,
    },
    {
      title: "Permissions",
      url: "/permissions",
      icon: IconShield,
    },
  ],

  userMenu: [
    {
      label: "Profile",
      url: "/profile",
      icon: IconUserCircle,
    },
    {
      label: "Workspace Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};