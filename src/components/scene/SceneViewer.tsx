import { useState } from 'react';
import type { Scene } from '@/types';
import { SceneTooltip } from './SceneTooltip';
import styles from './SceneViewer.module.css';

interface SceneViewerProps {
  scene: Scene;
}

export function SceneViewer({ scene }: SceneViewerProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <img
        src={`${import.meta.env.BASE_URL}${scene.image}`}
        alt={scene.title}
        className={styles.image}
        draggable={false}
      />
      {scene.hotspots.map((hotspot) => {
        const isActive = activeHotspot === hotspot.id;
        const showAbove = hotspot.area.y > 40;

        return (
          <div
            key={hotspot.id}
            className={`${styles.hotspot} ${isActive ? styles.active : ''}`}
            style={{
              left: `${hotspot.area.x}%`,
              top: `${hotspot.area.y}%`,
              width: `${hotspot.area.width}%`,
              height: `${hotspot.area.height}%`,
            }}
            onMouseEnter={() => setActiveHotspot(hotspot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            {isActive && (
              <SceneTooltip
                hotspot={hotspot}
                position={showAbove ? 'above' : 'below'}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
