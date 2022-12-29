import Lights from './Lights.js';
import Level from './Level.js';
import { Physics, Debug } from '@react-three/rapier';
import Player from './Player.js';

export default function Experience() {
  return (
    <>
      <Lights />
      <Physics>
        {/* <Debug /> */}
        <Level />
        <Player />
      </Physics>
    </>
  );
}
