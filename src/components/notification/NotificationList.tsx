import { useState } from "react";
import { Modal } from "../ui/Modal";
import Bell from "../../assets/icons/bell.svg";
import { NotificationCard } from "../ui/NotificationCard";
import { useNotifications } from "../../utils/useNotifications";
import useNotifyStore from "../../store/notificationStore";
import useAuthStore from "../../store/authStore";

const NotificationList = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const [modalData, setModalData] = useState<{
    title: string;
    text: string;
    id: null | string;
  }>({
    title: "",
    text: "",
    id: null,
  });
  const { unread, markRead } = useNotifyStore((s) => s);
  useNotifications(user?.id);

  const handleMarkRead = async (ids: string[]) => {
    if (!ids.length) return;
    await fetch(
      `${import.meta.env.VITE_API_URL}/notifications/mark-read/${user?.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }
    );
    markRead(ids);
  };

  return (
    <>
      <div className='bg-[#05A2C6CC] rounded-xl w-full h-full overflow-hidden'>
        <div className='overflow-auto h-full'>
          {unread.length ? (
            unread.map((el, i) => {
              return (
                <NotificationCard
                  key={i}
                  label={`${el.payload?.text}`}
                  onClick={() => {
                    setModalData({
                      title: `${el.payload?.text}`,
                      text: "",
                      id: el.id,
                    });
                    setOpen(true);
                  }}
                />
              );
            })
          ) : (
            <p className='px-3 py-2'>Sizda hech qanday bildirishnoma yoʻq</p>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          handleMarkRead([String(modalData.id)]);
          setOpen(false);
        }}>
        <img
          className='absolute left-1/2 -translate-1/2 -top-3 w-20'
          src={Bell}
          alt=''
        />
        <h2 className='text-xl font-semibold mb-3 pr-6 text-white mt-[50px] text-center'>
          {modalData.title}
        </h2>
        <div className='h-full overflow-auto max-h-80'>
          <p className='mb-3 mt-5 text-white'>{modalData.text}</p>
        </div>
      </Modal>
    </>
  );
};

export default NotificationList;
