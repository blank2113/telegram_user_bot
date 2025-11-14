import { useParams } from "react-router-dom";

const InvitePage = () => {
  const { botUsername } = useParams<{ botUsername: string }>();

  if (!botUsername) return <p>Бот не найден</p>;

  return (
    <div className='p-4 flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white'>
      <h1 className='text-2xl font-bold mb-4'>Присоединяйся к этому боту!</h1>
      <p className='mb-4'>{botUsername}</p>
      <a
        href={`https://t.me/${botUsername}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-cyan-400 underline'>
        Открыть в Telegram
      </a>
    </div>
  );
};

export default InvitePage;
