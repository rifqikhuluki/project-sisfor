import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';

const LogoutAlert = ({ onOpenChange, ...props }: AlertDialogProps) => {
    const handleLogout = () => {
        if (onOpenChange) onOpenChange(false);
        router.get('/login');
    };
    return (
        <AlertDialog onOpenChange={onOpenChange} {...props}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah anda yakin meninggalkan sesi ini ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/80"
                        onClick={handleLogout}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LogoutAlert;
