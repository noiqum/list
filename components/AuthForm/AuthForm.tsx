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
import { loginDTO, RegisterDTO } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/contexts/userContext';

interface AuthFormProps {
    formType: "login" | "register"
}

function AuthForm({ formType }: AuthFormProps) {
    const { setStoreUser } = useUser()
    const router = useRouter()
    const [serviceError, setServiceError] = useState<string | null>(null)
    const handleSubmit = async (values: typeof form.values) => {

        // login flow
        if (formType === "login") {
            const dto: loginDTO = {
                email: values.email,
                password: values.password
            }
            try {
                const response = await fetch(`https://list-api-7mn9.onrender.com/api/auth/login`, {
                    method: "POST",
                    body: JSON.stringify(dto),
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json"
                    }

                }).then(res => res.json())
                if (response.status === "success" || response.statusCode === 200) {
                    setStoreUser(response.data)
                    router.push("/")

                } else {
                    setServiceError(response.message || "Something went wrong, please try later.")
                }
            } catch (error) {
                setServiceError("Something went wrong, please try later.")
            }

        } else {
            //register flow
            const dto: RegisterDTO = {
                name: values.name as string,
                email: values.email,
                password: values.password
            }
            try {
                const response = await fetch(`https://list-api-7mn9.onrender.com/api/auth/register`, {
                    method: "POST",
                    body: JSON.stringify(dto),
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json"
                    }

                }).then(res => res.json())

                if (response.status === "success" || response.statusCode === 201) {
                    setStoreUser(response.data)
                    router.push("/")

                } else {
                    setServiceError(response.message || "Something went wrong, please try later.")
                }
            } catch (error) {
                setServiceError("Something went wrong, please try later.")
            }
        }
    };

    const handlerZodSchema = () => {
        if (formType === "login") {
            return z.object({
                email: z.string().email("please enter a valid email"),
                password: z.string().min(8, "password must be at least 8 letters")
            })
        }
        return z.object({
            name: z.string().min(3, "name should be 3 letters long at least"),
            email: z.string().email("please enter a valid email"),
            password: z.string().min(8, "password must be at least 8 letters")
        })

    }
    const handleInialValues = () => {
        if (formType === "login") {
            return {
                email: "",
                password: ""
            }
        }
        return {
            name: "",
            email: "",
            password: ""
        }

    }
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: handleInialValues(),
        validate: zodResolver(handlerZodSchema()),
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
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
                    {serviceError &&
                        <Text c="red" mt="md">{serviceError}</Text>
                    }
                    <Button loading={form.submitting} type="submit" fullWidth mt="xl">
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </form>
    );
}

export default AuthForm