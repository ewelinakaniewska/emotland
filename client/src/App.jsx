import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Start from "./pages/Start";
import RegisterParent from "./pages/RegisterParent";
import RegisterTherapist from "./pages/RegisterTherapist";
import Settings from "./pages/Settings"
import ParentStats from "./pages/ParentStats";
import History from "./pages/History"
import TherapistChapters from "./pages/TherapistChapters";
import TaskForm from "./pages/TaskForm";
import Chat from "./pages/Chat";
import TherapistTasks from "./pages/TherapistTasks";
import ChapterPage from "./pages/ChapterPage";
import { TaskProvider } from "./components/TaskContext";
import CreateChapterPage from "./pages/CreateChapterPage";
import Articles from "./pages/Articles"
import ChildMainPanel from "./pages/ChildMainPanel";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";
import TherapistStats from "./pages/TherapistStats";
import TherapistSettings from "./pages/TherapistSettings";
import NotFound from "./pages/NotFound"
import Forbidden from "./pages/Forbidden";
import ArticleForm from "./pages/ArticleForm";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/403" element={<Forbidden />} />


          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-parent" element={<RegisterParent />} />
          <Route path="/register-therapist" element={<RegisterTherapist />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />


          <Route path="/dashboard-parent-stats" element={<RequireAuth roles={["parent"]}><ParentStats /></RequireAuth>} />
          <Route path="/dashboard-parent-history" element={<RequireAuth roles={["parent"]}><History /></RequireAuth>} />
          <Route path="/dashboard-parent-chat" element={<RequireAuth roles={["parent"]}> <Chat /></RequireAuth>} />
          <Route path="/dashboard-parent-articles" element={<RequireAuth roles={["parent"]}><Articles /></RequireAuth>} />
          <Route path="/dashboard-parent-settings" element={<RequireAuth roles={["parent"]}><Settings /></RequireAuth>} />


          <Route path="/dashboard-therapist-stats" element={<RequireAuth roles={["therapist"]}><TherapistStats /></RequireAuth>} />
          <Route path="/dashboard-therapist-history" element={<RequireAuth roles={["therapist"]}><History /></RequireAuth>} />
          <Route path="/dashboard-therapist-chat" element={<RequireAuth roles={["therapist"]}><Chat /></RequireAuth>} />
          <Route path="/dashboard-therapist-articles" element={<RequireAuth roles={["therapist"]}><Articles /></RequireAuth>} />
          <Route path="/dashboard-therapist-settings" element={<RequireAuth roles={["therapist"]}><TherapistSettings /></RequireAuth>} />
          <Route path="/dashboard-therapist-articles/new" element={<RequireAuth roles={["therapist"]}><ArticleForm /></RequireAuth>} />
          <Route path="/dashboard-therapist-articles/edit/:id" element={<RequireAuth roles={["therapist"]}><ArticleForm /></RequireAuth>} />
          <Route path="/dashboard-therapist-tasks" element={<RequireAuth roles={["therapist"]}><TherapistTasks /></RequireAuth>} />
          <Route path="/dashboard-therapist-tasks/edit/:id" element={<RequireAuth roles={["therapist"]}><TaskForm /></RequireAuth>} />
          <Route path="/dashboard-therapist-tasks/new" element={<RequireAuth roles={["therapist"]}><TaskForm /></RequireAuth>} />
          <Route path="/dashboard-therapist-chapters/new" element={<RequireAuth roles={["therapist"]}><CreateChapterPage /></RequireAuth>} />
          <Route path="/dashboard-therapist-chapters/edit/:chapterId" element={<RequireAuth roles={["therapist"]}><CreateChapterPage /></RequireAuth>} />
          <Route path="/dashboard-therapist-chapters" element={<RequireAuth roles={["therapist"]}><TherapistChapters /></RequireAuth>} />


          <Route path="/dashboard-child-mainpanel" element={<RequireAuth roles={["child"]}><ChildMainPanel /></RequireAuth>} />
          <Route path="/chapter/:id" element={<RequireAuth roles={["child"]}><TaskProvider><ChapterPage /></TaskProvider></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
