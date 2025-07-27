import * as React from "react";

// Shared props for sidebar layout components
type SidebarComponentProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarProvider = ({ children }: SidebarComponentProps) => (
  <div className="flex min-h-screen">{children}</div>
);

export const Sidebar = ({ className = "", children }: SidebarComponentProps) => (
  <div className={`w-64 border-r bg-background ${className}`}>{children}</div>
);

export const SidebarHeader = ({ className = "", children }: SidebarComponentProps) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

export const SidebarContent = ({ className = "", children }: SidebarComponentProps) => (
  <div className={`flex-1 overflow-auto ${className}`}>{children}</div>
);

export const SidebarFooter = ({ className = "", children }: SidebarComponentProps) => (
  <div className={`p-4 border-t ${className}`}>{children}</div>
);

export const SidebarGroup = ({ className = "", children }: SidebarComponentProps) => (
  <div className={`py-2 ${className}`}>{children}</div>
);

export const SidebarGroupLabel = ({ className = "", children }: SidebarComponentProps) => (
  <h4 className={`px-2 py-1 text-sm font-semibold ${className}`}>{children}</h4>
);

export const SidebarGroupContent = ({ className = "", children }: SidebarComponentProps) => (
  <div className={className}>{children}</div>
);

export const SidebarMenu = ({ className = "", children }: SidebarComponentProps) => (
  <ul className={`space-y-1 ${className}`}>{children}</ul>
);

export const SidebarMenuItem = ({ className = "", children }: SidebarComponentProps) => (
  <li className={className}>{children}</li>
);

// Button with optional 'asChild' support (for Link/NavLink/etc.)
export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className = "", asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;

    return React.cloneElement(child, {
      ...props,
      ref,
      className: `w-full text-left px-2 py-1 rounded hover:bg-accent ${className} ${child.props.className || ""}`,
    });
  }

  return (
    <button
      ref={ref}
      className={`w-full text-left px-2 py-1 rounded hover:bg-accent ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";

// Trigger icon button (for toggling sidebar on mobile etc.)
export const SidebarTrigger = ({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={`p-2 rounded hover:bg-accent ${className}`} {...props}>
    ☰
  </button>
);
