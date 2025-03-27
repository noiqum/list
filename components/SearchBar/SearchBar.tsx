import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput, TextInputProps, useMantineTheme } from '@mantine/core';
import { useState, useEffect, useCallback } from 'react';

interface SearchBarProps extends TextInputProps {
    onSearch: (searchText: string) => void;
    debounceDelay?: number; // Optional debounce delay in milliseconds (default: 300ms)
}

export function SearchBar({ onSearch, debounceDelay = 300, placeholder, ...props }: SearchBarProps) {
    const theme = useMantineTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useCallback(
        (text: string) => {
            onSearch(text);
        },
        [onSearch]
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            debouncedSearch(searchTerm);
        }, debounceDelay);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, debounceDelay, debouncedSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.currentTarget.value);
    };

    const handleSearchButtonClick = () => {
        debouncedSearch(searchTerm);
    };

    return (
        <TextInput
            radius="xl"
            size="md"
            placeholder={placeholder}
            rightSectionWidth={42}
            leftSection={<IconSearch size={18} stroke={1.5} />}
            rightSection={
                <ActionIcon
                    size={32}
                    radius="xl"
                    color={theme.primaryColor}
                    variant="filled"
                    onClick={handleSearchButtonClick}
                >
                    <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
            }
            value={searchTerm}
            onChange={handleInputChange}
            {...props}
        />
    );
}