import { memo } from "react";
import image from "../../assets/images/games_png.png";

const GamesAnimatedImage = () => {
  return (
    <div className='game-image-wrapper'>
      <img src={image} alt='game' className='game-image' />
    </div>
  );
};

export default memo(GamesAnimatedImage);
