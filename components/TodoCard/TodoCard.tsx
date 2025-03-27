
import { baseURL, Todo } from "@/types";
import { ActionIcon, Badge, Button, Card, Checkbox, Group, Image, Modal, Text, TextInput, useModalsStack } from "@mantine/core";
import { useField } from "@mantine/form";
import { IconDownload, IconEdit, IconTrash, IconUpload } from "@tabler/icons-react";

interface TodoCardProps {
    todo: Todo
}

export const TodoCard = ({ todo }: TodoCardProps) => {
    const stack = useModalsStack(['delete-todo', 'confirm-delete', 'update', "success", "error"]);

    const field = useField({
        initialValue: todo.content,
        validate: (value) => (value.trim().length < 11 ? 'Value is too short' : null),
    });
    const handleDownload = (url: string) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = __filename || "downloaded-file";
                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error fetching the file:", error);
            });
    };
    const deleteHandler = async () => {
        try {
            const response = await fetch(`${baseURL.production}/api/todos/${todo.id}`, {
                method: "DELETE"
            }).then(res => res.json())
            if (response.status === "succes") {
                stack.open("success")
            }
        } catch (error) {
            stack.open("error")
            console.log(error)
        }
    }
    const updateHandler = async (newContent: string) => {
        try {
            const data = new FormData()
            data.append("content", newContent)
            const response = await fetch(`${baseURL.production}/api/todos/${todo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/formdata",
                }
            }).then(res => res.json())
            if (response.status === "success" || response.statusCode === 200) {
                stack.open("success")
            }
        } catch (error) {

        }
    }

    return (
        <>
            <Modal.Stack>
                <Modal {...stack.register("delete-todo")} title="Delete this todo?">
                    Are you sure you want to delete this page? This action cannot be undone.
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={stack.closeAll} variant="default">
                            Cancel
                        </Button>
                        <Button onClick={() => deleteHandler()} color="red">
                            Delete
                        </Button>
                    </Group>
                </Modal>
                <Modal {...stack.register('confirm-delete')} title="Update Todo">
                    <TextInput {...field.getInputProps()} label="Name" placeholder="Enter your name" mb="md" />

                    <Group mt="lg" justify="flex-end">
                        <Button onClick={stack.closeAll} variant="default">
                            Cancel
                        </Button>
                        <Button onClick={() => updateHandler(field.getValue())} color="red">
                            Save
                        </Button>
                    </Group>
                </Modal>
                <Modal {...stack.register("success")} title="Done">
                    İşlem başarılı
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={stack.closeAll} variant="default">
                            close
                        </Button>
                    </Group>
                </Modal>
                <Modal {...stack.register("error")} title="Error">
                    İşlem esnasında hata alınmıştır, Lütfen daha sonra deneyiniz
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={stack.closeAll} variant="default">
                            close
                        </Button>
                    </Group>
                </Modal>
            </Modal.Stack>
            <Card withBorder padding="lg" radius="md">
                <Group justify="space-between">
                    <Checkbox label="Completed"></Checkbox>
                    {(todo.tag !== undefined) ? <Badge>{todo.tag}</Badge> : <Badge>Add Tag</Badge>}
                </Group>
                <Text fz="lg" fw={500} mt="md">
                    {todo.content}
                </Text>
                <Text fz="sm" c="dimmed" mt={5}>
                    {todo.advice}
                </Text>
                <Group justify="flex-end" mt="md">
                    <Group>
                        {todo.image && <Image src={todo.file?.url} maw={60} mah={60} fit="contain"></Image>}
                    </Group>
                    <Group>
                        <ActionIcon>
                            <IconEdit size={18}></IconEdit>
                        </ActionIcon>
                        <ActionIcon onClick={() => stack.open("delete-todo")}>
                            <IconTrash size={18}></IconTrash>
                        </ActionIcon>
                        {todo.file !== null && <ActionIcon onClick={() => {
                            if (todo.file?.url) {
                                handleDownload(todo.file.url)
                            }
                        }
                        } variant="default" size="lg" radius="md">
                            <IconDownload size={18} />
                        </ActionIcon>}
                    </Group>
                </Group>
            </Card>
        </>
    )
}