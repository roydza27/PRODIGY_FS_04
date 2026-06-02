import { useEffect, useState } from "react";
import { api } from "./services/api";

type HealthResponse = {
  success: boolean;
  message: string;
};

function App() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(api.health);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json: HealthResponse = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchHealth();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Frontend is running</h1>
      {error ? <p>Error: {error}</p> : data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default App;