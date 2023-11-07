import {
  UserPlus,
  Settings,
  Users,
  PlusCircle,
  Trash,
  LogOut,
} from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface MenuItemProps {
  onClick: () => void;
}

export function InvitePeopleMenuItem({ onClick }: MenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
    >
      Invite People
      <UserPlus className="h-4 w-4 ml-auto" />
    </DropdownMenuItem>
  );
}

export function ServerSettingsMenuItem({ onClick }: MenuItemProps) {
  return (
    <DropdownMenuItem
      className="px-3 py-2 text-sm cursor-pointer"
      onClick={onClick}
    >
      Server Settings
      <Settings className="h-4 w-4 ml-auto" />
    </DropdownMenuItem>
  );
}

export function ManageMembersMenuItem() {
  return (
    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
      Manage Members
      <Users className="h-4 w-4 ml-auto" />
    </DropdownMenuItem>
  );
}

export function CreateChannelMenuItem() {
  return (
    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
      Create Channel
      <PlusCircle className="h-4 w-4 ml-auto" />
    </DropdownMenuItem>
  );
}

export function DeleteServerMenuItem() {
  return (
    <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
      Delete Server
      <Trash className="h-4 w-4 ml-auto" />
    </DropdownMenuItem>
  );
}

export function LeaveServerMenuItem() {
  return (
    <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
      Leave Server
      <LogOut className="h-4 w-4 ml-auto" />
    </DropdownMenuItem>
  );
}
