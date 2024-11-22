import { useState } from "react";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import useAuth from "@/hooks/auth/useAuth";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
};

const LocalForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  // const { login, register } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const toggleForm = () => setIsRegister(!isRegister);

  const onSubmit = (data: FormData) => {
    console.log(data);
    if (isRegister) {
      // register({
      //   name: data.name ?? "",
      //   email: data.email,
      //   password: data.password,
      //   confirmPassword: data.confirmPassword ?? "",
      // });
    } else {
      // login({
      //   email: data.email,
      //   password: data.password,
      // });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {isRegister && (
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isRegister && (
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="text-sm text-gray-500 text-center">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer"
              >
                Register
              </span>
            </>
          )}
        </div>

        <Button className="w-full" type="submit">
          {isRegister ? "Register" : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LocalForm;
