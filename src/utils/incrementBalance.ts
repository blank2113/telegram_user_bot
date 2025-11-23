import useAuthStore from "../store/authStore";

export async function incrementBalance(amount: number) {
  try {
    const user = useAuthStore.getState().user;
    const userId = user?.id;

    const res = await fetch(
      `http://localhost:3000/api/users/increment/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount }),
      }
    );
    if (!res.ok) {
      console.warn("increment balance failed", await res.text());
      return;
    }
    const data = await res.json();
    console.log(data);

    // useAuthStore.getState().patchUser({ balance: data.data.balance });
  } catch (err) {
    console.log(err);
  }
}
