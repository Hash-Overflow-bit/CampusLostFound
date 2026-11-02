import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Simple test components
const TestHome = () => (
  <div>
    <h1>Home Page</h1>
    <Link to="/about">Go to About</Link>
  </div>
);
const TestAbout = () => (
  <div>
    <h1>About Page</h1>
    <Link to="/">Go to Home</Link>
  </div>
);
const TestBlog = () => (
  <div>
    <h1>Blog Page</h1>
    <Link to="/">Go to Home</Link>
  </div>
);

const TestRoutes = () => {
  return (
    <Router>
      <nav style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        <Link to="/" style={{ margin: "0 10px" }}>
          Home
        </Link>
        <Link to="/about" style={{ margin: "0 10px" }}>
          About
        </Link>
        <Link to="/blog" style={{ margin: "0 10px" }}>
          Blog
        </Link>
      </nav>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/about" element={<TestAbout />} />
          <Route path="/blog" element={<TestBlog />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default TestRoutes;
