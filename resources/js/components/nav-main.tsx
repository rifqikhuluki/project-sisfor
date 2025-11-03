import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        permission?: string;
        items?: {
            title: string;
            url: string;
            permission?: string;
        }[];
    }[];
}) {
    const { url } = usePage();

    const isUrlActive = (target: string) => {
        if (!target || target === '#') return false;
        if (target === '/') return url === '/';
        return url === target || url.startsWith(target + '/');
    };

    const isGroupActive = (subitems?: { url: string }[]) =>
        !!subitems?.some((s) => isUrlActive(s.url));

    const { can } = usePermissions();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Fitur</SidebarGroupLabel>
            <SidebarMenu>
                {items
                    .map((item) => {
                        // Filter sub-items berdasarkan permission
                        const filteredSubItems = item.items?.filter(
                            (subItem) =>
                                !subItem.permission || can(subItem.permission),
                        );

                        return {
                            ...item,
                            items: filteredSubItems,
                        };
                    })
                    .filter((item) => {
                        // Filter parent item:
                        if (item.permission && !can(item.permission)) {
                            return false;
                        }

                        if (item.items && item.items.length === 0) {
                            return false;
                        }

                        return true;
                    })
                    .map((item) =>
                        item.items && item.items.length > 0 ? (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isGroupActive(item.items)}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((sub) => (
                                                <SidebarMenuSubItem
                                                    key={sub.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isUrlActive(
                                                            sub.url,
                                                        )}
                                                    >
                                                        <Link href={sub.url}>
                                                            <span>
                                                                {sub.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isUrlActive(item.url)}
                                >
                                    <Link
                                        href={item.url}
                                        className="flex items-center gap-2"
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ),
                    )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
