import React from "react";
import { SidebarTrigger } from "./sidebar";
import { NavUser } from "../nav-user";
import { BreadcrumbItem as Crumb, User } from "@/types";
import { AppBreadcrumb } from "../app-breadcrumb";

const user: User = {
    id: 1,
    name: 'meimei',
    email: 'meimei@example.com',
    avatar: '/avatars/shadcn.jpg'
}

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  breadcrumbs?: Crumb[];
}
const Navbar: React.FC<NavbarProps> = ({ breadcrumbs, className, ...rest }) => {
    return <header className="sticky z-10 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur top-0 flex shrink-0 items-center gap-2 border-b h-16 px-3" {...rest}>
        <SidebarTrigger />
        <AppBreadcrumb items={breadcrumbs ?? []} />
        <div className="ml-auto">
            <NavUser 
            user = {user}
            isNavbar
            btnClassName="hover:bg-transparent focus-visible:ring-0" />
        </div>
    </header>
}

export default Navbar;