import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const SidebarDesktop = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <div className="p-2 bg-red-500">Content</div>
        </SidebarContent>
        <SidebarTrigger />
      </Sidebar>
    </SidebarProvider>
  );
};
