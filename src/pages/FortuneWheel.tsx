// @ts-ignore

import { useEffect, useRef, useState, useMemo, type FC } from "react";
import Konva from "konva";
import { Stage, Layer, Group, Wedge, Text, Shape, Ring } from "react-konva";

import NiceSelector from "../components/ui/NiceSelector";
import NiceCoinInput from "../components/ui/NiceCoinInput";
import PlayButton from "../components/ui/PlayButton";

Konva.angleDeg = false;
// const degToRad = (deg: number) => (deg * Math.PI) / 180;
function normalizeAngle(a: number) {
  return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

const WEDGES = [
  { color: "#d0b1dd", label: "0" },
  { color: "#c7a3d6", label: "1" },
  { color: "#bf95d0", label: "2" },
  { color: "#b687ca", label: "3" },
  { color: "#ad78c4", label: "4" },
  { color: "#a56abd", label: "5" },
  { color: "#9c5cb7", label: "6" },
  { color: "#944eb1", label: "7" },
  { color: "#8848a3", label: "8" },
  { color: "#7c4295", label: "9" },
  { color: "#703b87", label: "10" },
  { color: "#643578", label: "11" },
  { color: "#592f6a", label: "12" },
  { color: "#4d295c", label: "13" },
  { color: "#41224e", label: "14" },
];

const V_SCENE_WIDTH = 440;
const V_SCENE_HEIGHT = 440;

const innerRadius = V_SCENE_WIDTH / 2 - 40;
const outerRadius = V_SCENE_WIDTH / 2 - 15;
// const RADIUS = V_SCENE_WIDTH / 2;
const SCENE_CENTER_X = V_SCENE_WIDTH / 2;
const SCENE_CENTER_Y = V_SCENE_HEIGHT / 2;

const FourtuneWheel: FC = () => {
  const [stageSize, setStageSize] = useState({
    width: V_SCENE_WIDTH,
    height: V_SCENE_HEIGHT,
    scale: 1,
  });
  const stageContainerRef = useRef(null);

  const [isSpinning, setIsSpinning] = useState(false);

  const wheelRef = useRef(null);
  const pointerRef = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  const updateSize = () => {
    if (!stageContainerRef.current) return;
    // @ts-ignore
    const containerWidth = stageContainerRef.current.offsetWidth;
    const scale = containerWidth / V_SCENE_WIDTH;

    setStageSize({
      width: V_SCENE_WIDTH * scale,
      height: V_SCENE_HEIGHT * scale,
      scale: scale,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const wedges = useMemo(() => {
    const angle = (2 * Math.PI) / WEDGES.length;

    const radius = stageSize.width / 2;
    const Rmid = radius * 0.65;
    // const tx = Math.cos(angle / 2) * Rmid;
    const ty = Math.sin(angle / 2) * Rmid;

    return WEDGES.map(({ label }) => {
      return (
        <Group key={label} rotation={(2 * +label * Math.PI) / WEDGES.length}>
          <Wedge
            radius={radius}
            angle={angle}
            stroke='#fff'
            strokeWidth={2.5}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndRadius={150}
            fillRadialGradientColorStops={[0, "#e10fa3", 0.8, "#5900cb"]}
            fill='#64e9f8'
            fillPriority='radial-gradient'
            strokeLinearGradientStartPoint={{ x: 100, y: 0 }}
            strokeLinearGradientEndPoint={{ x: 150, y: 0 }}
            strokeLinearGradientColorStops={[0, "#5900cb", 1, "#e10fa3"]}
          />
          <Text
            text={label}
            fontSize={24}
            fill='white'
            rotation={angle / 2} //+ Math.PI / 2
            x={radius - radius * Math.tan(angle / 2)}
            y={ty}
            offsetX={15}
            offsetY={5}
            listening={false}
          />
        </Group>
      );
    });
  }, [stageSize.width]);

  function getFinalAngle(targetIndex: number): number | undefined {
    if (!wheelRef.current) return;

    // @ts-ignore
    const currentRotation = wheelRef.current?.rotation() as number;
    const sliceAngle = (2 * Math.PI) / WEDGES.length;
    const pointerOffset = Math.PI / 2; // указатель сверху
    const turns = 2 + Math.random() * 2; // 4–6 оборотов

    const targetBase =
      -targetIndex * sliceAngle - // сектор
      pointerOffset - // стрелка сверху
      sliceAngle / 2; // центр сектора

    const normalizedCurrent = normalizeAngle(currentRotation);
    const normalizedTarget = normalizeAngle(targetBase);

    // разница между целевым углом и текущим (0..2π)
    let diff = normalizedTarget - normalizedCurrent;

    // если diff отрицательный → вращаем только вперёд
    if (diff < 0) diff += 2 * Math.PI;

    const final = currentRotation + diff + 2 * Math.PI * Math.ceil(turns);

    return final;
  }

  function spinTo(value: number) {
    if (!wheelRef.current) return;
    setIsSpinning(true);

    const finalRotation = getFinalAngle(value);

    new Konva.Tween({
      node: wheelRef.current,
      duration: 5,
      rotation: finalRotation,
      easing: Konva.Easings.ElasticEaseInOut,
      onFinish: () => {
        setIsSpinning(false);
      },
    }).play();
  }

  const getValueAndSpin = () => {
    const value = Math.floor(Math.random() * WEDGES.length);
    console.log("DEBUG: Target value - ", value);
    spinTo(value);
  };

  return (
    <div className='flex items-center justify-center bg-transparent py-16 w-full '>
      <div className='w-full max-w-md  rounded-2xl shadow-md py-4 px-2 bg-white/10 backdrop-blur-md  border border-[#24E6F3CC]'>
        <div
          ref={stageContainerRef}
          id='wheel-container'
          className='wheel-container flex flex-col justify-center items-center'
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}>
          <>
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              scaleX={stageSize.scale}
              scaleY={stageSize.scale}>
              <Layer ref={layerRef} listening={false}>
                <Group
                  ref={wheelRef}
                  rotation={0}
                  x={SCENE_CENTER_X}
                  y={SCENE_CENTER_Y}>
                  {wedges}

                  <Ring
                    // x={SCENE_CENTER_X}
                    // y={SCENE_CENTER_Y}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    // fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                    // fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                    // fillRadialGradientStartRadius={innerRadius}
                    // fillRadialGradientEndRadius={outerRadius}
                    // fillRadialGradientColorStops={[
                    //   0,
                    //   '#5900cb', // center color
                    //   1,
                    //   '#e10fa3', // outer color
                    // ]}
                    shadowBlur={10}
                    shadowColor='#e10fa3'
                    fill='#5900cb'
                    // strokeLinearGradientStartPoint={{ x: -90, y: 0 }}
                    // strokeLinearGradientEndPoint={{ x: 90, y: 0 }}
                    // strokeLinearGradientColorStops={[
                    //   0,
                    //   '#4facfe',
                    //   1,
                    //   '#00f2fe',
                    // ]}
                    // stroke="#333"
                    // strokeWidth={3}
                  />

                  <Shape
                    // x={SCENE_CENTER_X}
                    // y={SCENE_CENTER_Y}
                    shadowBlur={10}
                    shadowColor='blue'
                    sceneFunc={(ctx) => {
                      for (let a = 0; a < Math.PI * 2; a += 0.7) {
                        // точка в середине толщины кольца
                        const x =
                          Math.cos(a) *
                          (innerRadius + (outerRadius - innerRadius) / 2);
                        const y =
                          Math.sin(a) *
                          (innerRadius + (outerRadius - innerRadius) / 2);

                        ctx.beginPath();
                        ctx.fillStyle = "#fff";
                        ctx.arc(x, y, 6, 0, Math.PI * 2);
                        ctx.fill();
                      }
                    }}
                  />
                </Group>

                <Wedge
                  ref={pointerRef}
                  fill={"white"}
                  angle={0.5}
                  radius={45}
                  x={SCENE_CENTER_X}
                  y={V_SCENE_HEIGHT - V_SCENE_HEIGHT * 0.88}
                  rotation={-Math.PI / 2 - 0.25}
                  stroke={"#944eb1"}
                  shadowBlur={10}
                  shadowColor='red'
                />
              </Layer>
            </Stage>

            <div className='flex flex-col gap-6 w-full'>
              <NiceSelector />

              <div className='flex gap-4 flex-col'>
                <NiceCoinInput />

                <PlayButton
                  className='w-full'
                  isSpinning={isSpinning}
                  onClick={getValueAndSpin}>
                  O’ynash
                </PlayButton>
              </div>
            </div>
            {/* <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"></button> */}
          </>
        </div>
      </div>
    </div>
  );
};

export default FourtuneWheel;
