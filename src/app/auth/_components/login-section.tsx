"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Provider } from "@supabase/supabase-js";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "~/components/shared/Icons";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const Login = () => {
  const formSchema = z.object({
    password: z.string().min(8, {
      message: "Name must be at least 2 characters long",
    }),
    email: z.string().email({
      message: "Invalid email address",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const signInWithOauth = async (provider: Provider) => {
    await signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <section className="w-full p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign up / Login</h1>
      <div className="mb-4 flex flex-col items-center gap-2 xs:flex-row">
        <Button
          variant="secondary"
          className="w-full gap-2"
          onClick={() => {
            void signInWithOauth("google");
          }}
        >
          <Icons.google width={18} height={18} />
          Login in Google
        </Button>
        <Button
          variant="secondary"
          className="w-full gap-2"
          disabled
          onClick={() => {
            void signInWithOauth("github");
          }}
        >
          <Icons.gitHub width={18} height={18} />
          Login in Github
        </Button>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <p className="text-text-secondary">or sign up / login with email</p>
          <div className="h-[1px] flex-1 bg-border"></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="readwonder@storyteller.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Login;
