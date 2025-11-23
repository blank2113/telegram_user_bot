import { useState, useRef, useEffect } from "react";
import { FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";
import useAuthStore from "../../store/authStore";

const ProfileName = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [tempName, setTempName] = useState(user?.name || "Blanked");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    // Если user обновился из стора — синхронизируем tempName
    setTempName(user?.name || "Blanked");
  }, [user?.name]);

  const handleSave = async () => {
    if (!tempName.trim()) {
      alert("Имя не может быть пустым");
      return;
    }

    setIsEditing(false);

    try {
      const formData = new FormData();
      formData.append("name", tempName.trim());

      const res = await fetch(`http://localhost:3000/api/users/${user?.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Ошибка обновления пользователя:", data);
        alert(data.message || "Ошибка при обновлении");
      } else {
        console.log("Пользователь обновлён:", data);
        setUser(data.user); // обновляем глобальный стор
      }
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      alert("Ошибка при отправке запроса");
    }
  };

  const handleCancel = () => {
    setTempName(user?.name || "Blanked");
    setIsEditing(false);
  };

  return (
    <div className='relative z-20 flex items-center justify-between w-full px-3 py-2'>
      <div className='flex-1'>
        {isEditing ? (
          <input
            ref={inputRef}
            type='text'
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className='w-full text-white text-[22px] bg-[#071240CC] border-b-2 border-transparent focus:border-[#24E6F3] transition-all duration-300 rounded px-2 py-1 outline-none placeholder-gray-400'
            placeholder='Введите имя'
          />
        ) : (
          <p className='text-white text-[22px] transition-all duration-300'>
            {user?.name || "Blanked"}
          </p>
        )}
      </div>

      <div className='ml-4 flex items-center gap-2'>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className='flex items-center gap-1 bg-[#24E6F3] text-black p-3 rounded-full hover:bg-[#1fc3d8] transition-all active:scale-95'>
              <FaCheck />
            </button>
            <button
              onClick={handleCancel}
              className='flex items-center gap-1 bg-gray-600 text-white p-3 rounded-full hover:bg-gray-500 transition-all active:scale-95'>
              <FaTimes />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className='flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-2xl text-gray-300 hover:bg-gray-700 transition-all active:scale-95'>
            <FaRegEdit className='text-[14px]' />
            <span className='text-[12px]'>o’zgartirish</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileName;
