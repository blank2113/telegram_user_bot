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
  const botUrl = `https://t.me/${botUsername}?start=2`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    botUrl
  )}&text=${encodeURIComponent(inviteText)}`;

  // const [copied, setCopied] = useState(false);

  const openTelegramShare = (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      // Если внутри Telegram WebApp — используем openLink
      // @ts-ignore
      if (window?.Telegram?.WebApp?.openLink) {
        // @ts-ignore
        window.Telegram.WebApp.openLink(shareUrl);
        return;
      }
    } catch {}
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(botUrl);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 1600);
  //   } catch {
  //     alert(
  //       "Не удалось автоматически скопировать. Скопируйте вручную: " + botUrl
  //     );
  //   }
  // };

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

      <div className='w-full h-0.5 bg-linear-to-r from-white/0 via-white/50 to-white/0' />

      <p className='text-white text-center text-sm'>
        Do'stingizning yo'nalishi bo'lish uchun ularning havolasini qo'shing.
        Shundan so'ng, siz ularning yo'nalishi sifatida ro'yxatdan o'tasiz.
      </p>

      <div className='w-full'>
        <div className='bg-[#071240B2] w-full p-3 rounded-3xl text-gray-200 text-center wrap-break-word select-all text-sm'>
          <a
            href={botUrl}
            onClick={(e) => {
              e.preventDefault();
              try {
                // @ts-ignore
                if (window?.Telegram?.WebApp?.openLink) {
                  // @ts-ignore
                  window.Telegram.WebApp.openLink(botUrl);
                  return;
                }
              } catch {}
              window.open(botUrl, "_blank", "noopener,noreferrer");
            }}
            className='text-cyan-100 underline'
            target='_blank'
            rel='noopener noreferrer'>
            {botUrl}
          </a>
        </div>
      </div>

      <div className='w-full flex flex-col gap-2'>
        <button
          onClick={openTelegramShare}
          className='w-full bg-[#B7F8FF] p-3 transform transition-transform duration-200 rounded-3xl active:scale-95'>
          Nusxalash
        </button>
      </div>
    </div>
  );
};

export default TelegramLinkPopup;
