// Types matching GET /admin/sidebar response shape exactly

export interface SidebarLeaf {
  label: string;
  route: string;
  actions: Record<string, boolean>;
}

export interface SidebarGroup {
  label: string;
  children: MenuNode[];
}

/** Discriminated union — narrow by presence of "route" vs "children" */
export type MenuNode = SidebarLeaf | SidebarGroup;

export interface SidebarData {
  permissions: string[];
  menu: MenuNode[];
}

export interface SidebarResponse {
  success: boolean;
  message: string;
  data: SidebarData;
}
