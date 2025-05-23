import { cn } from "@/shared/lib/utils";
import { PlusIcon, UserPlusIcon, FolderPlusIcon, TrashIcon, ArrowRightStartOnRectangleIcon} from "@heroicons/react/24/outline";
export interface IconButtonProps {
    icon: string;
    onClick?: () => void;
    size?: string;
    color?: string;
}

function getIcon(icon: string, size: string = 'size-4', color: string = 'text-white') {
    switch (icon) {
        case 'plus':
          return <PlusIcon className={cn(size, color)}/>;
        case 'user-plus':
          return <UserPlusIcon className={cn(size, color)}/>
        case 'folder-plus':
          return <FolderPlusIcon className={cn(size, color)}/>
        case 'trash':
          return <TrashIcon className={cn(size, color)}/>
        case 'leave':
          return <ArrowRightStartOnRectangleIcon className={cn(size, color)} />
        default:
          return null;
    }
}

export function IconButton({ icon, onClick, size, color, ...props }:React.ButtonHTMLAttributes<HTMLButtonElement> & IconButtonProps) {
    return (
        <button
          {...props}
          className="cursor-pointer"
          onClick={onClick}
        >
          {getIcon(icon, size, color)}
        </button>
    );
} 