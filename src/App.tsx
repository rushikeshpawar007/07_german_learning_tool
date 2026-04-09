import { HashRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from '@/context/ProgressContext';
import { LearningModeProvider } from '@/context/LearningModeContext';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/pages/HomePage';
import { VocabularyListPage } from '@/pages/VocabularyListPage';
import { VocabularyDetailPage } from '@/pages/VocabularyDetailPage';
import { SituationListPage } from '@/pages/SituationListPage';
import { SituationDetailPage } from '@/pages/SituationDetailPage';
import { SentenceBuilderPage } from '@/pages/SentenceBuilderPage';
import { GrammarListPage } from '@/pages/GrammarListPage';
import { GrammarDetailPage } from '@/pages/GrammarDetailPage';
import { PerfektVerbsPage } from '@/pages/PerfektVerbsPage';
import { ReadingListPage } from '@/pages/ReadingListPage';
import { ReadingDetailPage } from '@/pages/ReadingDetailPage';
import { ActivityLogPage } from '@/pages/ActivityLogPage';
import { VocabQuizPage } from '@/pages/VocabQuizPage';
import { DialogueListPage } from '@/pages/DialogueListPage';
import { DialogueDetailPage } from '@/pages/DialogueDetailPage';
import { ExploreScenePage } from '@/pages/ExploreScenePage';
import { ReviewPage } from '@/pages/ReviewPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <LearningModeProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vocabulary" element={<VocabularyListPage />} />
            <Route path="/vocabulary/:id" element={<VocabularyDetailPage />} />
            <Route path="/situations" element={<SituationListPage />} />
            <Route path="/situations/:slug" element={<SituationDetailPage />} />
            <Route path="/builder" element={<SentenceBuilderPage />} />
            <Route path="/builder/:sentenceId" element={<SentenceBuilderPage />} />
            <Route path="/grammar" element={<GrammarListPage />} />
            <Route path="/grammar/perfekt-verbs" element={<PerfektVerbsPage />} />
            <Route path="/grammar/:topicId" element={<GrammarDetailPage />} />
            <Route path="/reading" element={<ReadingListPage />} />
            <Route path="/reading/:id" element={<ReadingDetailPage />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
            <Route path="/vocab-quiz" element={<VocabQuizPage />} />
            <Route path="/dialogues" element={<DialogueListPage />} />
            <Route path="/dialogues/:id" element={<DialogueDetailPage />} />
            <Route path="/explore" element={<ExploreScenePage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LearningModeProvider>
      </ProgressProvider>
    </HashRouter>
  );
}
