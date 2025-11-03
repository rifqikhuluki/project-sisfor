import React, { ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import type { PageProps } from "@/types";;
import { SidebarInset, SidebarProvider } from "./sidebar";
import { AppSidebar } from "../app-sidebar";
import Navbar from "./nav-bar";
import { Toaster } from "sonner";
import { BreadcrumbItem } from "@/types";

interface LayoutProps extends React.HTMLAttributes<HTMLElement>{
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs, ...headerProps }) => {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user ?? null; 

    return(
        <SidebarProvider>
            <AppSidebar />
                <SidebarInset>
                    <Navbar  breadcrumbs={breadcrumbs} {...headerProps} />
                    <main>
                        {children}
                    </main>
                    <Toaster position="top-center"/>
                </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout;