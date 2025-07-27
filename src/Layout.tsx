import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield,
  Database,
  BarChart3,
  Download,
  Globe,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    title: "Threat Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "IOC Database",
    url: createPageUrl("IOCs"),
    icon: Database,
  },
  {
    title: "Sources",
    url: createPageUrl("Sources"),
    icon: Globe,
  },
  {
    title: "Export Data",
    url: createPageUrl("Export"),
    icon: Download,
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider>

      <div className="min-h-screen flex w-full">
        <Sidebar className="cyber-border border-r bg-gray-900/50 backdrop-blur-sm">
          <SidebarHeader className="cyber-border border-b p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center cyber-glow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-100 text-lg">ThreatHunter</h2>
                <p className="text-xs text-cyan-400 font-medium">
                  Cyber Threat Intelligence
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-cyan-400 uppercase tracking-wider px-2 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`transition-all duration-300 rounded-lg mb-2 text-gray-300 hover:text-white hover:bg-gray-700/60
                          ${location.pathname === item.url
                            ? "!bg-cyan-500/10 !text-cyan-300 border border-cyan-500/30"
                            : ""
                          }`}
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 px-3 py-3"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-cyan-400 uppercase tracking-wider px-2 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-4 space-y-3 cyber-card rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Active IOCs</span>
                    <span className="font-bold text-cyan-400">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sources</span>
                    <span className="font-bold text-cyan-400">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Today</span>
                    <span className="font-bold text-green-400">0 new</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="cyber-border border-t p-4">
            <div className="flex items-center gap-3 cyber-card rounded-lg p-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-100 text-sm truncate">
                  Threat Hunter
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Security Analyst
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="lg:hidden cyber-card border-b p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-700/50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-100">ThreatHunter</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
