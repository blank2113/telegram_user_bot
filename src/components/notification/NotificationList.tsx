import { useState } from 'react';
import { Modal } from '../ui/Modal';
import Bell from '../../assets/icons/bell.svg';
import { NotificationCard } from '../ui/NotificationCard';

const NotificationList = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="bg-[#05A2C6CC] rounded-xl w-full h-full overflow-hidden">
        <div className="overflow-auto h-full">
          {new Array(15).fill(null).map((_, i) => {
            return (
              <NotificationCard
                key={i}
                amount={10}
                label="limon"
                time="1 daqiqa oldin"
                onClick={() => setOpen(true)}
              />
            );
          })}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tailwind + Motion"
      >
        <img
          className="absolute left-1/2 -translate-1/2 -top-3 w-24"
          src={Bell}
          alt=""
          srcset=""
        />
        <h2 className="text-xl font-semibold mb-3 pr-6 text-white mt-[50px]">
          +10 limon limon limon +10 limon limon limon
        </h2>
        <div className="h-full overflow-auto max-h-80">
          <p className="mb-3 mt-5 text-white">
            +10 limon o’ynash uchun+10 limon o’ynash uchun+10 limon o’ynash
            uchun+10 limon o’ynash uchun+10 limon o’ynash uchun+10 limon o’ynash
            uchun+10 limon o’ynash uchun+10 limon o’ynash uchun+10 limon o’ynash
            uchun+10 limon o’ynash uchun+10 limon o’ynash
          </p>
        </div>
      </Modal>
    </>
  );
};

export default NotificationList;
