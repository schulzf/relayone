"use client";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [activeItemWidth, setActiveItemWidth] = useState(0);
  const [activeItemLeft, setActiveItemLeft] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [];

  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = navItems.findIndex((item) => item.href === pathname);
      if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
        const activeItem = itemsRef.current[activeIndex];
        if (activeItem && navRef.current) {
          const navRect = navRef.current.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();

          setActiveItemWidth(itemRect.width);
          setActiveItemLeft(itemRect.left - navRect.left);
        }
      }
    };

    const timer = setTimeout(() => {
      updatePosition();
      setInitialRender(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, navItems]);

  useEffect(() => {
    const handleResize = () => {
      if (!initialRender) {
        const activeIndex = navItems.findIndex(
          (item) => item.href === pathname
        );
        if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
          const activeItem = itemsRef.current[activeIndex];
          if (activeItem && navRef.current) {
            const navRect = navRef.current.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();

            setActiveItemWidth(itemRect.width);
            setActiveItemLeft(itemRect.left - navRect.left);
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialRender, pathname, navItems]);

  return (
    <div className={cn("flex items-center", className)}>
      <Link href="/" className="flex items-center space-x-2 mr-6">
        <Image src="/images/logo.png" alt="logo" width={45} height={45} />
      </Link>

      <nav className="flex items-center space-x-1 relative" ref={navRef}>
        <div
          className={cn(
            "absolute h-full rounded-md bg-primary/10 -z-10 transition-all duration-300",
            initialRender ? "opacity-0" : "opacity-100"
          )}
          style={{
            width: `${activeItemWidth}px`,
            left: `${activeItemLeft}px`,
            transitionProperty: initialRender ? "none" : "all",
          }}
        />

        {navItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => (itemsRef.current[index] = el) as any}
            className="px-1"
          >
            <Button
              variant="ghost"
              className={cn(
                "text-sm font-medium transition-colors relative z-10",
                pathname === item.href
                  ? "text-primary hover:bg-transparent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
