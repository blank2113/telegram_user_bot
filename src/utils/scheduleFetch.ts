import useAuthStore from "../store/authStore";

export async function scheduleFetch(date: string) {
  try {
    const user = useAuthStore.getState().user;
    const userId = user?.id;

    const res = await fetch(
      `http://localhost:3000/api/clicks/maxLimit/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date }),
      }
    );
    if (!res.ok) {
      console.warn("mark limit failed", await res.text());
      return;
    }
    const data = await res.json();
    console.log(data);

    useAuthStore.getState().patchUser({ maxTotalLimit: data.maxTotalLimit });
  } catch (err) {
    console.log(err);
  }
}
