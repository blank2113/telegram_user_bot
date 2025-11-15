import image from "../../assets/images/home_main_img.webp";

const SIZE = 230;

const AnimatedImage = () => {
  return (
    <div
      aria-hidden={false}
      style={{
        width: SIZE,
        height: SIZE,
        minWidth: SIZE,
        minHeight: SIZE,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(255,255,255,0.02))",
      }}>
      <div
        aria-hidden
        className='image-placeholder'
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.03))",
          pointerEvents: "none",
        }}
      />

      <img
        src={image}
        alt=''
        loading='lazy'
        decoding='async'
        width={SIZE}
        height={SIZE}
        className='floating-image'
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          borderRadius: 12,
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default AnimatedImage;
