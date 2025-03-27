import {
    IconPlus,
} from '@tabler/icons-react';
import {

    Box,
    Burger,
    Button,

    Divider,
    Drawer,
    Group,

    Modal,
    ScrollArea,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './MegaMenu.module.css';
import CreateForm from '../CreateForm/CreateForm';



export function MegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);




    return (
        <Box pb={120}>
            <Modal opened={opened} onClose={close} title="Add Todo">
                <CreateForm />
            </Modal>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Text fs="italic" size='xl' c={"blue"}>List</Text>
                    <Group visibleFrom="sm">
                        <Button onClick={open} variant="gradient">Add <IconPlus></IconPlus></Button>
                        <Button variant="default">Log Out</Button>
                    </Group>
                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default">Log Out</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}