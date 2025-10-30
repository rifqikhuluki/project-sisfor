import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Breadcrumb as UIBreadcrumb,
} from '@/components/ui/breadcrumb'; // <- file bawaanmu
import type { BreadcrumbItem as Crumb } from '@/types';
import * as React from 'react';

interface AppBreadcrumbProps {
    items: Crumb[];
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ items }) => {
    if (!items?.length) return null;

    return (
        <UIBreadcrumb aria-label="Breadcrumb">
            <BreadcrumbList>
                {items.map((b, i) => {
                    const isLast = i === items.length - 1;
                    const label = (b as any).title ?? (b as any).label; // dukung title/label
                    return (
                        <React.Fragment key={i}>
                            <BreadcrumbItem>
                                {isLast || !b.href ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={b.href}>
                                        {label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </UIBreadcrumb>
    );
};
