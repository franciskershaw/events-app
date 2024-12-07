import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/pages/Auth/hooks/useAuth";

import { loginSchema, registerSchema } from "./localFormSchema";

type FormData = z.infer<typeof loginSchema>;

const LocalForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  const { login, register } = useAuth();

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const toggleForm = () => {
    setIsRegister(!isRegister);
    form.clearErrors();
  };

  const onSubmit = (data: FormData) => {
    if (isRegister) {
      register({
        name: data.name ?? "",
        email: data.email,
        password: data.password,
      });
    } else {
      login({
        email: data.email,
        password: data.password,
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {isRegister && (
          <FormInput name="name" label="Name">
            <Input placeholder="Enter your name" />
          </FormInput>
        )}
        <FormInput name="email" label="Email">
          <Input placeholder="Enter your email" />
        </FormInput>

        <FormInput name="password" label="Password">
          <Input type="password" placeholder="Enter your password" />
        </FormInput>

        {isRegister && (
          <FormInput name="confirmPassword" label="Confirm Password">
            <Input type="password" placeholder="Confirm your password" />
          </FormInput>
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
