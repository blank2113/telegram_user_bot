import useNotifyStore from "../../store/notificationStore";
import { useNotifications } from "../../utils/useNotifications";

const NotificationList = () => {
  const userId = "2"; // или достать из authStore
  const { unread, markRead } = useNotifyStore((s) => s);

  useNotifications(userId);

  const handleMarkRead = async (ids: string[]) => {
    if (!ids.length) return;
    await fetch(`http://localhost:3000/api/notifications/mark-read/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    markRead(ids);
  };

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Уведомления</h2>
      {unread.length === 0 && <p>Нет новых уведомлений</p>}
      <ul>
        {unread.map((n) => (
          <li key={n.id} className='border-b py-2 flex justify-between'>
            <span>{n?.payload?.text}</span>
            <button
              onClick={() => handleMarkRead([n.id])}
              className='text-sm text-blue-500'>
              Прочитать
            </button>
          </li>
        ))}
      </ul>
      {unread.length > 0 && (
        <button
          onClick={() => handleMarkRead(unread.map((n) => n.id))}
          className='mt-4 px-3 py-1 bg-blue-500 text-white rounded'>
          Отметить все как прочитанные
        </button>
      )}
    </div>
  );
};

export default NotificationList;
