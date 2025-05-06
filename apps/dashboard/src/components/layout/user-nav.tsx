"use client";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SignOutButton, useUser} from "@clerk/nextjs";
import {LogOut, Settings, User} from "lucide-react";
import Image from "next/image";

export function UserNav() {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          {user && user.hasImage && (
            <Image
              src={user.imageUrl!}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full max-w-[32px] max-h-[32px]"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Test Company</p>
            <p className="text-xs leading-none text-muted-foreground">
              email@testcompany.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>
            <div className="flex items-center gap-4">
              <LogOut className="size-4" />
              <span>Log out</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
