'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Message, continueConversation } from '@/app/example-uploader/actions';
import { UploadButton } from '@/utils/uploadthing';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
  url: z.string().url(),
  timestamp: z.string(),
  instructions: z.string(),
});

export const maxDuration = 30;

export default function UploadFormWithChat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      timestamp: '',
      instructions: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!uploadedImageUrl) {
      alert('Please upload a screenshot before submitting.');
      return;
    }

    const messageContent = `
      URL: ${values.url}
      Timestamp: ${values.timestamp}
      Instructions: ${values.instructions}
      Screenshot: ${uploadedImageUrl}
    `;

    const newMessages = [
      ...conversation,
      { role: 'user' as const, content: messageContent }
    ];

    const { messages } = await continueConversation(newMessages);
    setConversation(messages);

    form.reset();
    setUploadedImageUrl('');
  };

  return (
    <div className="flex flex-row space-x-4 p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Upload Form</CardTitle>
          <CardDescription>Enter URL, timestamp, instructions, and upload a screenshot.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the URL you want to upload.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timestamp</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2w, 3d, 2023-06-15" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the timestamp (e.g. '2w' for 2 weeks ago, '3d' for 3 days ago, or a specific date).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions for LLM</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter instructions for the LLM" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide any specific instructions for the LLM.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Screenshot</FormLabel>
                <FormControl>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      if (res && res[0]) {
                        setUploadedImageUrl(res[0].url);
                        alert("Upload Completed");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload a screenshot.
                </FormDescription>
              </FormItem>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Submit</Button>
        </CardFooter>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Chat Interface</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto">
          {conversation.map((message, i) => (
            <div key={i} className={`mb-4 ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
              <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
              {message.content}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}