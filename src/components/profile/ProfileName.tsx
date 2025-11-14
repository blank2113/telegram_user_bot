import { useState, useRef, useEffect } from "react";
import { FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";

const ProfileName = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("JOV_UZB_777");
  const [tempName, setTempName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
    console.log("Saved name:", tempName);
    // здесь можно вызвать API для сохранения на сервере
  };

  const handleCancel = () => {
    setTempName(name);
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
            {name}
          </p>
        )}
      </div>

      <div className='ml-4 flex items-center gap-2'>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className='flex items-center gap-1 bg-[#24E6F3] text-black p-3  rounded-full hover:bg-[#1fc3d8] transition-all active:scale-95'>
              <FaCheck />
            </button>
            <button
              onClick={handleCancel}
              className='flex items-center gap-1 bg-gray-600 text-white p-3  rounded-full hover:bg-gray-500 transition-all active:scale-95'>
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
