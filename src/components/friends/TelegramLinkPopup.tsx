import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  onClose?: () => void;
  botUsername?: string;
  inviteText?: string;
};

const TelegramLinkPopup = ({
  onClose,
  botUsername = "test_user_appp_bot",
  inviteText = "Присоединяйся к этому боту!",
}: Props) => {
  const inviteUrl = `${window.location.origin}/invite/${botUsername}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    inviteUrl
  )}&text=${encodeURIComponent(inviteText)}`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      alert(
        `Не удалось автоматически скопировать. Скопируйте вручную: ${inviteUrl}`
      );
    }
  };

  const openTelegramShare = () => {
    try {
      // WebApp
      // @ts-ignore
      if (window?.Telegram?.WebApp?.openLink) {
        // @ts-ignore
        window.Telegram.WebApp.openLink(shareUrl);
        return;
      }
    } catch {}
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className='flex flex-col items-center gap-5 p-4'>
      <div className='w-full relative'>
        <p className='text-center text-xl text-white font-semibold'>
          Taklifingiz
        </p>
        <button
          className='absolute top-0 right-0 hover:scale-105 active:scale-95 transition-all'
          onClick={onClose}
          aria-label='Close'>
          <IoMdCloseCircle className='text-3xl text-white' />
        </button>
      </div>

      <div className='w-full h-0.5 bg-gradient-to-r from-white/0 via-white/50 to-white/0' />

      <p className='text-white text-center text-sm'>
        Do'stingizning yo'nalishi bo'lish uchun ularning havolasini qo'shing.
      </p>

      <div className='w-full'>
        <div className='bg-[#071240B2] w-full p-3 rounded-3xl text-gray-200 text-center break-words select-all'>
          <a
            href={inviteUrl}
            onClick={(e) => {
              e.preventDefault();
              try {
                // @ts-ignore
                if (window?.Telegram?.WebApp?.openLink) {
                  // @ts-ignore
                  window.Telegram.WebApp.openLink(inviteUrl);
                  return;
                }
              } catch {}
              window.open(inviteUrl, "_blank", "noopener,noreferrer");
            }}
            className='text-cyan-100 underline'
            target='_blank'
            rel='noopener noreferrer'>
            {inviteUrl}
          </a>
        </div>
      </div>

      <div className='w-full flex flex-col gap-2'>
        <button
          onClick={copyToClipboard}
          className='w-full bg-[#B7F8FF] p-3 transform transition-transform duration-200 rounded-3xl active:scale-95'>
          {copied ? "Saqlandi" : "Nusxalash"}
        </button>

        <button
          onClick={openTelegramShare}
          className='w-full mt-1 bg-[#2AABEE] p-3 rounded-3xl text-white transform transition hover:brightness-105 active:scale-95'>
          Yuborish — Telegram'ga ochish
        </button>
      </div>
    </div>
  );
};

export default TelegramLinkPopup;
