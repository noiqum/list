"use client"

import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import {
    Anchor,
    Button,
    Container,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import classes from "./AuthForm.module.css"
import { loginDTO } from '@/types';

import Link from 'next/link';
import { redirect } from 'next/navigation';

interface AuthFormProps {
    formType: "login" | "register"
}

function AuthForm({ formType }: AuthFormProps) {
    const handleSubmit = async (values: typeof form.values) => {
        if (formType === "login") {
            const dto: loginDTO = {
                email: values.email,
                password: values.password
            }

            const response = await fetch(`https://list-api-7mn9.onrender.com/api/auth/login`, {
                method: "POST",
                body: JSON.stringify(dto),
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                }

            }).then(res => res.json())
            if (response.status === "success") {
                redirect("/todos")
            }
        }
    };

    const handlerZodSchema = () => {
        if (formType === "login") {
            return z.object({
                email: z.string().email("please enter a valid email"),
                password: z.string().min(8, "password must be at least 8 letters")
            })
        } else {
            return z.object({
                name: z.string().min(3, "name should be 3 letters long at least"),
                email: z.string().email("please enter a valid email"),
                password: z.string().min(8, "password must be at least 8 letters")
            })
        }
    }
    const handleInialValues = () => {
        if (formType === "login") {
            return {
                email: "",
                password: ""
            }
        } else {
            return {
                name: "",
                email: "",
                password: ""
            }
        }
    }
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: handleInialValues(),
        validate: zodResolver(handlerZodSchema()),
        validateInputOnBlur: true,

    });

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Container size={420} my={40}>
                <Title ta="center" className={classes.title}>
                    Welcome !
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    {formType === "login" ? "Do not have an account yet?" : "Already have an account ?"}
                    <Link href={formType === "login" ? "/register" : "/auth"}><Anchor size="sm" component="button">
                        {formType === "login" ? "Create an Account" : "Login"}
                    </Anchor></Link>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    {formType === "register"
                        &&
                        <TextInput
                            label="Name"
                            placeholder='john Doe'
                            key={form.key("name")}
                            {...form.getInputProps("name")}
                            required />
                    }
                    <TextInput
                        label="Email"
                        placeholder="you@gmail.com"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                        required />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                        required mt="md" />

                    <Button type="submit" fullWidth mt="xl">
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </form>
    );
}

export default AuthForm