import {
  IconUsers,
  IconBuilding,
  IconUserCircle,
} from "@tabler/icons-react";
import type { SidebarData } from "../types/sidebar";

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