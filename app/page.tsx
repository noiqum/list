"use client";

import { MegaMenu } from "@/components/Menu/MegaMenu";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { TodoCard } from "@/components/TodoCard/TodoCard";
import { useUser } from "@/contexts/userContext";
import { baseURL, Todo } from "@/types";
import { Grid, Text } from "@mantine/core";
import { Pagination } from '@mantine/core';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function HomePage() {
  const { user } = useUser()
  const router = useRouter()
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [serviceError, setServiceError] = useState<null | string>(null)
  const [searchResults, setSearchResults] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user?.id) {
      const getTodosByUser = async () => {
        try {

          const response = await fetch(`${baseURL.production}/todos/?page=${currentPage}&limit=${10}`, {
            credentials: "include",
            cache: "no-cache",
            headers: {
              token: user.token
            }
          }).then(res => res.json())
          if (response.status === "success") {
            setTotalPage(response.pagination.totalPages)
            setTodoList(response.data)

          }
          if (response.statusCode === 401) {
            router.push("/auth")
          }
        } catch (error) {
          console.log(error)
          setServiceError("Could not get todos")
        }
      }
      getTodosByUser()
    } else {
      router.push("/auth")
    }
  }, [user?.id, currentPage])


  const handleSearch = async (searchText: string) => {
    if (!searchText.trim()) {
      setSearchResults(todoList);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseURL.production}/api/todos/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchText }),
      });

      if (response.ok) {
        const data: Todo[] = await response.json();
        setSearchResults(data);
      } else {
        console.error('Search failed:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MegaMenu></MegaMenu>
      <SearchBar
        placeholder="search todo"
        maw={700}
        mx="auto"
        my="lg"
        onSearch={handleSearch}
        debounceDelay={500}
      />
      {loading && <p style={{ textAlign: 'center' }}>Searching...</p>}
      {searchResults.length > 0 && <Text size="xl"> Search Results:</Text>}
      {searchResults.length > 0 && <Grid>
        {searchResults.map(todoItem => {
          return <Grid.Col key={todoItem.id} span={{ base: 12, md: 6, lg: 3 }}><TodoCard todo={todoItem} /></Grid.Col>

        })}
      </Grid>}
      <Grid>
        {todoList.map(todoItem => {
          return <Grid.Col key={todoItem.id} span={{ base: 12, md: 6, lg: 3 }}><TodoCard todo={todoItem} /></Grid.Col>

        })}
      </Grid>
      <Pagination onChange={setCurrentPage} total={totalPage} value={currentPage}></Pagination>
    </>
  );
}
