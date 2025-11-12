const UnAuthorizePage = () => {
  const tgBotLink = "https://t.me/test_user_appp_bot";
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <a
        href={tgBotLink}
        target='_blank'
        rel='noopener noreferrer'
        className='px-6 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:scale-105 transition-transform duration-300 relative z-10'>
        Перейти к Telegram-боту
      </a>
    </div>
  );
};

export default UnAuthorizePage;
