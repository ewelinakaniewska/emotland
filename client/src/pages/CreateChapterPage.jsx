import { useParams } from "react-router-dom";
import ChapterCreateWizard from "../components/chapterWizard/ChapterCreateWizard";
import Nav from "../components/Nav"
export default function CreateChapterPage() {
  const { chapterId } = useParams();
  return (
    <>
      <Nav />
      <ChapterCreateWizard
        mode={chapterId ? "edit" : "create"}
        chapterId={chapterId}
      />
    </>
  );
}
