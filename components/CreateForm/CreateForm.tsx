"use client";
import { TextInput, Button, FileInput, Container, Text } from "@mantine/core";
import { useState } from "react";
import { DatePickerInput } from '@mantine/dates';
import { baseURL } from "@/types";
import { useUser } from "@/contexts/userContext";
import { useRouter } from "next/navigation";





function CreateForm() {
    const { user } = useUser()
    const router = useRouter()
    const [serviceError, setServiceError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [data, setData] = useState<{ content: string, dueDate: string, tag: string }>({
        content: "",
        dueDate: "",
        tag: ""
    })
    const [errors, setErros] = useState<{
        content: string | null,
        dueDate: string | null,
        image: string | null,
        document: string | null
    }>({
        content: null, document: null, dueDate: null, image: null
    })
    const [image, setImage] = useState<File | null>(null)
    const [document, setDocument] = useState<File | null>(null)

    const submitHandler = async () => {
        if (data.content.length <= 10) {
            const updatedErrors = {
                ...errors,
                content: "must be at least 10 char long"
            }
            setErros(updatedErrors)
        }
        if (data.dueDate.length < 2) {
            const updatedErrors = {
                ...errors,
                dueDate: "pick a date , please"
            }
            setErros(updatedErrors)
        }
        if (errors.content === null && errors.document === null && errors.dueDate === null && errors.image === null) {
            setIsSubmitting(true)
            try {
                const formdata = new FormData()
                formdata.append("userId", user?.id as string)
                formdata.append("content", data.content)
                formdata.append("dueDate", data.dueDate)
                formdata.append("tag", data.tag)
                formdata.append("image", image!)
                formdata.append("file", document!)
                const response = await fetch(`${baseURL.production}/api/todos`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(res => res.json())
                if (response.status === "error") {
                    if (response.statusCode === 401) {
                        router.push("/auth")
                    } else {
                        setServiceError(response.message || "something went wrong")
                    }
                }

            } catch (error) {
                console.log(error)
                setServiceError("hata alındı")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return <Container >
        <TextInput
            withAsterisk
            label="Content"
            placeholder="read a book"
            onChange={(e) => {

                setErros({
                    ...errors, content: ""
                })
                setData({ ...data, content: e.target.value })
            }}
            my="sm"

        />
        {errors.content && <Text c="red" size="md">{errors.content}</Text>}
        <DatePickerInput
            withAsterisk
            label="Pick due date"
            placeholder="Till end of month"
            onChange={(e) => setData({ ...data, dueDate: e?.toISOString() as string })}
            my="sm"

        />
        {errors.dueDate && <Text c="red" size="md">{errors.dueDate}</Text>}
        <TextInput
            label="Tag"
            placeholder="work"
            onChange={e => setData({ ...data, tag: e.target.value })}
            my="sm"

        ></TextInput>
        <FileInput onChange={e => setImage(e)} clearable accept="image/png,image/jpeg" my="sm" label="Image"></FileInput>
        <FileInput onChange={e => setDocument(e)} accept="application/pdf" my="sm" label="Document"></FileInput>
        <Button loading={isSubmitting} onClick={submitHandler} type="submit" variant="gradient">Save</Button>
    </Container>

}

export default CreateForm