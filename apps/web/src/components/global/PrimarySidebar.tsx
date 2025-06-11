"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ChevronRight, PlusCircle } from "lucide-react";
import AddWebsiteDialog from "../shared/AddWebsiteDialog";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function PrimarySidebar() {

  const websites = useQuery(api.websites.listWebsites);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Websites
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {websites?.map((website) => (
                <SidebarMenuItem key={website._id}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={`/websites/${website._id}`} 
                      className="px-2 py-1 hover:bg-neutral-100 w-full flex items-center justify-between group/link"
                    >
                      {website.title} <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-all duration-500" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AddWebsiteDialog>
          <Button variant='outline' className='w-full h-10 rounded-none shadow-none group/button'>
            <PlusCircle className='w-4 h-4 group-hover/button:rotate-180 transition-transform duration-500' />
            Add Website
          </Button>
        </AddWebsiteDialog>
      </SidebarFooter>
    </Sidebar>
  )
};