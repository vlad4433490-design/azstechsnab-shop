"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@azstechsnab.ru");
  const [password, setPassword] = useState("admin12345");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const payload = (await response.json()) as { ok?: true; error?: { message: string } };
    setIsLoading(false);

    if (!response.ok || payload.error) {
      setError(payload.error?.message ?? "Не удалось войти");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <section className="container-page py-10">
      <p className="page-kicker">Админ-панель</p>
      <h1 className="mt-3 text-4xl font-extrabold">Вход администратора</h1>
      <form className="card mt-7 max-w-md rounded-md p-6" onSubmit={submit}>
        <label>
          <span className="label">Email</span>
          <input
            className="field"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />
        </label>
        <label className="mt-4 block">
          <span className="label">Пароль</span>
          <input
            className="field"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </label>
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        ) : null}
        <Button className="mt-5 w-full" disabled={isLoading}>
          {isLoading ? "Проверка..." : "Войти"}
        </Button>
        <p className="mt-4 text-sm font-semibold text-[#52627a]">
          Demo: admin@azstechsnab.ru / admin12345
        </p>
      </form>
    </section>
  );
}
