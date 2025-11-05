'use client';

import { usePage } from '@inertiajs/react';
import { BookOpen, Bot, HomeIcon, Settings2 } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import type { PageProps } from '@/types';

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/',
            icon: HomeIcon,
            permission: 'dashboard.view',
        },
        {
            title: 'Kelola Pesanan',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Kasir',
                    url: '/kasir',
                },
                {
                    title: 'List Pesanan',
                    url: '#',
                },
            ],
        },
        {
            title: 'Kelola Menu',
            url: '/menu',
            icon: BookOpen,
            permission: 'menu.view',
        },
        {
            title: 'Kelola Stok',
            url: '#',
            icon: Settings2,
        },
        {
            title: 'Kelola Pengguna',
            url: '',
            icon: Bot,
            items: [
                {
                    title: 'Pengguna',
                    url: '/user',
                    permission: 'user.view',
                },
                {
                    title: 'Roles',
                    url: '/roles',
                    permission: 'roles.view',
                },
                {
                    title: 'Permission',
                    url: '/permission',
                    permission: 'permission.view',
                },
            ],
        },
        {
            title: 'Kelola Laporan',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Laporan Pemasukkan',
                    url: '#',
                },
                {
                    title: 'Laporan Keuangan',
                    url: '#',
                },
                {
                    title: 'Laporan Karyawan',
                    url: '#',
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { props: inertia } = usePage<PageProps>();
    const user = inertia.auth?.user ?? null;

    const navUser = {
        id: user?.id ?? 0,
        name: user?.name ?? 'Guest',
        email: user?.email ?? '',
        avatar: user?.avatar ?? '/avatars/default.png',
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="px-4 py-2 text-lg font-bold">
                    {inertia.name}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea>
                    <NavMain items={data.navMain} />
                    {/* <NavProjects projects={data.projects} /> */}
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
