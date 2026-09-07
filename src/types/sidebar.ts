// TODO: Define Sidebar types matching GET /admin/sidebar response shape
export interface SidebarItem {
  id: number;
  label: string;
  icon?: string;
  href?: string;
  children?: SidebarItem[];
}

export interface SidebarResponse {
  success: boolean;
  data: SidebarItem[];
}
