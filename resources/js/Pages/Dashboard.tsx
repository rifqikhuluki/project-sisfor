// import { AppSidebar } from '@/components/app-sidebar';
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
// import { Separator } from '@/components/ui/separator';
// import {
//     SidebarInset,
//     SidebarProvider,
//     SidebarTrigger,
// } from '@/components/ui/sidebar';

// export default function Page() {
//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//                     <div className="flex items-center gap-2 px-4">
//                         <SidebarTrigger className="-ml-1" />
//                         <Separator
//                             orientation="vertical"
//                             className="mr-2 data-[orientation=vertical]:h-4"
//                         />
//                         <Breadcrumb>
//                             <BreadcrumbList>
//                                 <BreadcrumbItem className="hidden md:block">
//                                     <BreadcrumbLink href="#">
//                                         Building Your Application
//                                     </BreadcrumbLink>
//                                 </BreadcrumbItem>
//                                 <BreadcrumbSeparator className="hidden md:block" />
//                                 <BreadcrumbItem>
//                                     <BreadcrumbPage>
//                                         Data Fetching
//                                     </BreadcrumbPage>
//                                 </BreadcrumbItem>
//                             </BreadcrumbList>
//                         </Breadcrumb>
//                     </div>
//                 </header>
//                 <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//                     <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                         <div className="aspect-video rounded-xl bg-muted/50" />
//                         <div className="aspect-video rounded-xl bg-muted/50" />
//                         <div className="aspect-video rounded-xl bg-muted/50" />
//                     </div>
//                     <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
//                 </div>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// }

import ChartBarLabel from '@/components/chart-bar';
import ChartPieLabelList from '@/components/chart-pie';
import DatePicker from '@/components/date-picker';
import SummaryCards from '@/components/summary-cards';
import DataTable from '@/components/table-order';
import { Button } from '@/components/ui/button';
import Layout from '@/components/ui/layout';
import { BreadcrumbItem } from '@/types';
import { Activity, CreditCard, DollarSign, Filter, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/' }];

const summaryData = [
    { title: 'Total Revenue', icon: DollarSign, value: '$45,231.89' },
    { title: 'Subscriptions', icon: Users, value: '+2350' },
    { title: 'Sales', icon: CreditCard, value: '+12,234' },
    { title: 'Active Now', icon: Activity, value: '+573' },
];

const Dashboard = () => {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="m-7 flex items-end justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <div className="flex items-center gap-2">
                    <DatePicker />
                    <Button>
                        <Filter className="2-4 mr-1 h-4" /> Filter
                    </Button>
                </div>
            </div>

            <div className="m-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {summaryData.map((item) => (
                    <SummaryCards
                        key={item.title}
                        title={item.title}
                        icon={item.icon}
                        value={item.value}
                    />
                ))}
            </div>

            <div className="m-7 mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ChartBarLabel />
                <ChartPieLabelList />
            </div>

            <div className="m-7 flex items-end justify-between">
                <h1 className="text-xl font-bold">Data Pesanan</h1>
            </div>

            <div className="m-7 flex items-end justify-between">
                <DataTable />
            </div>
        </Layout>
    );
};

export default Dashboard;
