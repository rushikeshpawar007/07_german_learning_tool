import { PageShell } from '@/components/layout/PageShell';
import { SceneViewer } from '@/components/scene/SceneViewer';
import { cityStreetScene } from '@/data/scenes/city-street';
import styles from './ExploreScenePage.module.css';

export function ExploreScenePage() {
  return (
    <PageShell
      title="Explore the Scene"
      subtitle="Hover over objects to discover German vocabulary in context"
    >
      <div className={styles.sceneWrapper}>
        <SceneViewer scene={cityStreetScene} />
      </div>
      <p className={styles.hint}>
        This scene has {cityStreetScene.hotspots.length} hidden words to discover. Move your mouse over the image!
      </p>
    </PageShell>
  );
}
