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

  navMain: [],

  documents: [
    {
      name: "Workspace Settings",
      url: "/settings",
      icon: IconBuilding,
    },
  ],

  navSecondary: [
    {
      title: "Members",
      url: "/members",
      icon: IconUsers,
    },
  ],

  userMenu: [
    {
      label: "Profile",
      url: "/profile",
      icon: IconUserCircle,
    },
  ],
};