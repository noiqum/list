import { redirect } from 'next/navigation';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';




export default async function HomePage() {
  const data = await fetch("http://localhost:8080/api/todos/?page=2&limit=10").then(res => {
    if (res.status === 401) {
      return redirect("/auth")
    } else {
      return res
    }
  })

  return (
    <>
      <Welcome />
      <pre>
        {
          data.json()
        }
      </pre>

    </>
  );
}
