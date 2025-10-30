'use client';

import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    GalleryVerticalEnd,
    HomeIcon,
    Settings2,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

import { ScrollArea } from '@/components/ui/scroll-area';

// This is sample data.
const data = {
    user: {
        id: 1,
        name: 'meimei',
        email: 'meimei@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Mei mei',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Dashboard',
            url: '/',
            icon: HomeIcon,
        },
        {
            title: 'Kelola Pesanan',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Kasir',
                    url: '#',
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
        },
        {
            title: 'Kelola Stok',
            url: '#',
            icon: Settings2,
        },
        {
            title: 'Kelola Karyawan',
            url: '#',
            icon: Settings2,
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
    // projects: [
    //     {
    //         name: 'Design Engineering',
    //         url: '#',
    //         icon: Frame,
    //     },
    //     {
    //         name: 'Sales & Marketing',
    //         url: '#',
    //         icon: PieChart,
    //     },
    //     {
    //         name: 'Travel',
    //         url: '#',
    //         icon: Map,
    //     },
    // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea>
                    <NavMain items={data.navMain} />
                    {/* <NavProjects projects={data.projects} /> */}
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
