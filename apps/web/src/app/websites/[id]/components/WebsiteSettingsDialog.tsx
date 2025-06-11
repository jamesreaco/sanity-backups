"use client"

import { z } from 'zod';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { api } from '../../../../../convex/_generated/api';
import React, { useState, useEffect, useRef } from 'react';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../../../components/ui/form';

import { 
  Dialog, 
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
});

export default function WebsiteSettingsDialog({ children, website }: { 
  children: React.ReactNode, website: Doc<"websites">
}) {
  
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const updateWebsite = useMutation(api.websites.updateWebsite);
  const deleteWebsite = useMutation(api.websites.deleteWebsite);

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

  useEffect(() => {
    if (website) {
      form.reset({
        title: website.title,
        sanityConfig: {
          projectId: website.sanityConfig.projectId,
          dataset: website.sanityConfig.dataset,
          apiVersion: website.sanityConfig.apiVersion,
          token: website.sanityConfig.token,
        }
      });
    }
  }, [website, form]);

  async function onSubmit() {
    try {
      await updateWebsite({
        id: website._id,
        title: form.getValues("title"),
        sanityConfig: form.getValues("sanityConfig"),
      })
      toast.success('Website updated successfully');
    } catch(error) {
      toast.error('Failed to update website');
      console.log('Failed to update website', error)
      return;
    }
    form.reset()
    setOpen(false)
  };

  async function onDelete() {
    setIsDeleting(true);
    try {
      await deleteWebsite({
        id: website._id,
      })
      router.push("/")
      toast.success('Website deleted successfully');
    } catch(error) {
      console.log('Failed to delete website', error)
      toast.error('Failed to delete website');
      return;
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='h-full' asChild>
        {children}
      </DialogTrigger>
      <DialogContent >
        <button ref={initialFocusRef} className="sr-only" aria-hidden />
        <DialogHeader>
          <DialogTitle>Website Settings</DialogTitle>
        </DialogHeader>
        <FormContainer>
          <Form {...form} >
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5"
            >
              <fieldset className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => {
                  return(
                    <FormItem>
                      <FormLabel>Website Name</FormLabel>
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
                <Button 
                  variant="destructive" 
                  type="button" 
                  className='w-20'
                  onClick={onDelete}
                >
                  {isDeleting ? (
                    <Loader size={10} className='animate-spin' />
                  ): (
                    <span>Delete</span>
                  )}
                </Button>
                <ButtonSeperator />
                <Button 
                  variant="outline" 
                  type="button" 
                  className='w-20'
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className='w-20'>
                  {form.formState.isSubmitting ? (
                    <Loader size={10} className='animate-spin' />
                  ): (
                    <span>Update</span>
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

function ButtonSeperator() {
  return (
    <div className="h-10 w-[1px] bg-neutral-200"></div>  
  )
};