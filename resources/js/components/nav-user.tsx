import { ChevronsUpDown, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { useState } from 'react';
import LogoutAlert from './logout-alert';

type Props = {
    user: User | null;
    btnClassName?: string;
    isNavbar?: boolean;
};

function initials(name?: string) {
    if (!name) return 'GU';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last = parts[1]?.[0] ?? '';
    return (first + last || first).toUpperCase();
}

export function NavUser({ user, isNavbar, btnClassName }: Props) {
    const { isMobile } = useSidebar();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const displayName = user?.name ?? 'Guest';
    const displayEmail = user?.email ?? '—';
    const avatar = user?.avatar ?? '/avatars/default.png';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                'data-[state=open]:bg-sidebar-accent data-[statte=open]:text-sidebar-accent-foreground',
                                btnClassName,
                            )}
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatar} alt={displayName} />
                                <AvatarFallback className="rounded-lg">
                                    {initials(displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {displayName}
                                </span>
                                <span className="truncate text-xs">
                                    {displayEmail}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile || isNavbar ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        {isNavbar && (
                            <>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={avatar}
                                                alt={displayName}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                {initials(displayName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {displayName}
                                            </span>
                                            <span className="truncate text-xs">
                                                {displayEmail}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {/* <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup> */}
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem
                            onClick={() => setShowLogoutAlert(true)}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            <LogoutAlert
                open={showLogoutAlert}
                onOpenChange={setShowLogoutAlert}
            />
        </SidebarMenu>
    );
}
