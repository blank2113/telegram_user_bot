import ProfileImg from "../components/profile/ProfileImg";
import ProfileName from "../components/profile/ProfileName";
import CustomButton from "../components/ui/CustomButton";
import tg from "../assets/icons/tg.svg";
import ProfileStats from "../components/profile/ProfileStats";

const Profile = () => {
  const botUrl = `https://t.me/test_user_appp_bot?start=2`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    botUrl
  )}&text=${encodeURIComponent("Присоединяйся к этому боту!")}`;

  return (
    <div className='w-full h-full flex flex-col items-center py-5 relative  gap-5 overflow-y-scroll pb-35'>
      <ProfileImg />
      <ProfileName />
      <div className='w-full px-3 '>
        <CustomButton
          title='Telegram guruhi'
          className='text-[12px] w-full relative z-10'
          img={<img src={tg} alt='' />}
          onClick={(e?: React.MouseEvent) => {
            e?.preventDefault();
            try {
              // @ts-ignore
              if (window?.Telegram?.WebApp?.openLink) {
                // @ts-ignore
                window.Telegram.WebApp.openLink(shareUrl);
                return;
              }
            } catch {}
            window.open(shareUrl, "_blank", "noopener,noreferrer");
          }}
        />
      </div>
      <ProfileStats />
    </div>
  );
};

export default Profile;
