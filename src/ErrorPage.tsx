import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const msg = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : (error as Error)?.message ?? "Erro desconhecido";
  return (
    <div style={{ padding: 24 }}>
      <h2>Ops! Algo deu errado.</h2>
      <pre>{msg}</pre>
    </div>
  );
}
