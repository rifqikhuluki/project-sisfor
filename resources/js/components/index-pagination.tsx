import { Pagination } from '@/types/pagination';
import { Link } from '@inertiajs/react';
import { Button } from './ui/button';

export default function IndexPagination<T>({ data }: { data: Pagination<T> }) {
    return (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-10 sm:justify-between">
            <div className="text-sm text-muted-foreground">
                {data.from && data.to ? (
                    <>
                        {data.from}-{data.to} dari {data.total}
                    </>
                ) : (
                    <>Tidak ada data</>
                )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {data.links.map((link, index) => {
                    const isDisabled = !link.url;

                    if (isDisabled) {
                        return (
                            <Button
                                key={index}
                                variant={'outline'}
                                disabled
                                size={'sm'}
                                className="pointer-events-none opacity-50"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }
                    return (
                        <Button
                            key={index}
                            asChild
                            size={'sm'}
                            variant={link.active ? 'default' : 'outline'}
                        >
                            <Link
                                href={link.url as string}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
