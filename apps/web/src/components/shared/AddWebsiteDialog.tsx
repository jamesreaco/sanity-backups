"use client"

import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { slugify } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sanityConfig: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    dataset: z.string().min(1, "Dataset is required"),
    apiVersion: z.string().min(1, "API Version is required"),
    token: z.string().min(1, "Token is required"),
  })
})

export default function AddWebsiteDialog({ children }: { children: React.ReactNode }) {

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sanityConfig: {
        projectId: "",
        dataset: "",
        apiVersion: "",
        token: "",
      }
    }
  });

  const createWebsite = useMutation(api.websites.createWebsite);

  async function onSubmit() {
    try {
      const website = await createWebsite({
        title: form.getValues("title"),
        slug: slugify(form.getValues("title")),
        sanityConfig: form.getValues("sanityConfig"),
      })
      form.reset()
      setOpen(false)
      router.push(`/websites/${website}`);
      toast.success('Website created successfully');
    } catch(error) {
      console.log('Failed to create website', error)
      toast.error('Failed to create website');
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Website</DialogTitle>
        </DialogHeader>
        <FormContainer>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5"
            >
              <fieldset className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => {
                  return(
                    <FormItem>
                      <FormLabel>Wesbite Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='Acme Inc.'  
                        />
                      </FormControl>
                    </FormItem>
                  )
                }} />
                <FormField control={form.control} name="sanityConfig.projectId" render={({ field }) => {
                  return(
                    <FormItem>
                      <FormLabel>Sanity Project ID</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='sp91****'  
                        />
                      </FormControl>
                    </FormItem>
                  )
                }} />
              </fieldset>
              <fieldset className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="sanityConfig.dataset" render={({ field }) => {
                  return(
                    <FormItem>
                      <FormLabel>Sanity Dataset</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='production'  
                        />
                      </FormControl>
                    </FormItem>
                  )
                }} />
                <FormField control={form.control} name="sanityConfig.apiVersion" render={({ field }) => {
                  return(
                    <FormItem>
                      <FormLabel>Sanity API Version</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='2024-01-16'  
                        />
                      </FormControl>
                    </FormItem>
                  )
                }} />
              </fieldset>
              <FormField control={form.control} name="sanityConfig.token" render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Sanity API Token</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder='skXKORO*******************************'  
                      />
                    </FormControl>
                  </FormItem>
                )
              }} />
              <ButtonContainer>
                <DialogClose>
                  <Button variant="outline" type="button" className='w-20'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className='w-20'>
                  {form.formState.isSubmitting ? (
                    <Loader size={10} className='animate-spin' />
                  ): (
                    <span>Add</span>
                  )}
                </Button>
              </ButtonContainer>
            </form>
          </Form>
        </FormContainer>
      </DialogContent>
    </Dialog>
  )
};

function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 pt-2">
      {children}
    </div>
  )
};

function ButtonContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className='pt-1 flex justify-end gap-2 w-full'>
      {children}
    </div>
  )
};