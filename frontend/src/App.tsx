import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormEditor from "./components/FormEditor";
import FormList from "./components/FormList";
import FormPreview from "./components/FormPreview";
import NotFound from "./components/NotFound";
import { Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="container max-w-2xl p-4 mx-auto">
        <Navbar />

        <Routes>
          <Route path="/" element={<FormList />} />
          <Route path="/create" element={<FormEditor />} />
          <Route path="/edit/:id" element={<FormEditor />} />
          <Route path="/preview/:id" element={<FormPreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

const Navbar = () => {
  return (
    <nav className="px-4 mb-8 bg-gray-800 rounded">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-white">Form Builder</h1>
          </div>
          <div className="flex items-center">
            <Link
              to="/"
              className="hover:bg-gray-700 px-3 py-2 text-white rounded"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="hover:bg-gray-700 px-3 py-2 text-white rounded"
            >
              Create Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
