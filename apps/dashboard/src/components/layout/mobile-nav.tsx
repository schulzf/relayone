"use client";

import {ModeToggle} from "@/components/layout/mode-toggle";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {Menu} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes: Array<{ href: string; label: string }> = [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="mb-8">
          <SheetTitle className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 py-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2">
            <ModeToggle />
            <span className="text-sm">Theme</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
