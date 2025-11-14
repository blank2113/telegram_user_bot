import { useEffect, useRef, useState, useMemo, type FC } from 'react';
import Konva from 'konva';
import { Stage, Layer, Group, Wedge, Text } from 'react-konva';

Konva.angleDeg = false;
const degToRad = (deg) => (deg * Math.PI) / 180;
function normalizeAngle(a) {
  return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

const WEDGES = [
  { color: '#d0b1dd', label: '0' },
  { color: '#c7a3d6', label: '1' },
  { color: '#bf95d0', label: '2' },
  { color: '#b687ca', label: '3' },
  { color: '#ad78c4', label: '4' },
  { color: '#a56abd', label: '5' },
  { color: '#9c5cb7', label: '6' },
  { color: '#944eb1', label: '7' },
  { color: '#8848a3', label: '8' },
  { color: '#7c4295', label: '9' },
  { color: '#703b87', label: '10' },
  { color: '#643578', label: '11' },
  { color: '#592f6a', label: '12' },
  { color: '#4d295c', label: '13' },
  { color: '#41224e', label: '14' },
];
const NUM_WEDGES = 14;
const FRICTION = 0.2;
const MIN_TURNS = 2;
const MAX_TURNS = 5;

function Wheel() {
  const [size, setSize] = useState(window.innerWidth * 0.8);
  const [isSpinning, setIsSpinning] = useState(false);

  const wheelRef = useRef(null);
  const pointerRef = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const resize = () => setSize(window.innerWidth * 0.8);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const wedges = useMemo(() => {
    const angle = (2 * Math.PI) / WEDGES.length;
    const radius = size / 2;
    return WEDGES.map(({ color, label }) => (
      <Group key={label} rotation={(2 * +label * Math.PI) / WEDGES.length}>
        <Wedge
          radius={radius}
          angle={angle}
          fill={color}
          stroke="#fff"
          strokeWidth={2.5}
        />
        <Text
          text={label}
          fontSize={14}
          fill="white"
          stroke="yellow"
          strokeWidth={1}
          rotation={(Math.PI + angle) / 2}
          x={radius - 40}
          y={20}
          listening={false}
        />
      </Group>
    ));
  }, [size]);

  function getFinalAngle(targetIndex) {
    if (!wheelRef.current) return;

    const currentRotation = wheelRef.current.rotation();
    const sliceAngle = (2 * Math.PI) / WEDGES.length;
    const pointerOffset = Math.PI / 2; // указатель сверху
    const turns = 2 + Math.random() * 2; // 4–6 оборотов

    console.log(turns, turns * 2 * Math.PI);
    // базовый нужный угол (абсолютный)
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
    console.log(turns);

    const final = currentRotation + diff + 2 * Math.PI * Math.ceil(turns);

    return final;
  }

  function spinTo(value) {
    if (!wheelRef.current) return;
    setIsSpinning(true);

    const finalRotation = getFinalAngle(value);

    new Konva.Tween({
      node: wheelRef.current,
      duration: 4,
      rotation: finalRotation,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        console.log('Готово! Остановились на секторе:', value);
        setIsSpinning(false);
      },
    }).play();
  }

  const getValueAndSpin = () => {
    const value = Math.floor(Math.random() * WEDGES.length);
    console.log('value', value);

    spinTo(value);
  };

  return (
    <>
      <Stage ref={stageRef} width={size} height={size}>
        <Layer ref={layerRef}>
          <Group ref={wheelRef} rotation={0} x={size / 2} y={size / 2}>
            {wedges}
          </Group>

          <Wedge
            ref={pointerRef}
            fill={'white'}
            angle={1}
            radius={30}
            x={size / 2}
            y={20}
            rotation={-Math.PI / 2 - 0.5}
            stroke={'#944eb1'}
            shadowBlur={10}
            shadowColor="red"
          />
        </Layer>
      </Stage>

      <button
        onClick={() => {
          getValueAndSpin();
        }}
        disabled={isSpinning}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isSpinning ? 'Вращение...' : 'Крутить колесо'}
      </button>
    </>
  );
}

const FourtuneWheel: FC = () => {
  return (
    <div className="flex items-center justify-center bg-transparent py-16 w-full h-full overflow-y-scroll">
      <div className="w-full max-w-md mx-4 rounded-2xl shadow-md py-4 px-1 bg-white/5 backdrop-blur-md  border border-white/10">
        <div
          id="wheel-container"
          className="wheel-container flex flex-col justify-center items-center"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <Wheel />
        </div>
      </div>
    </div>
  );
};

export default FourtuneWheel;
