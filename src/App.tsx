import { Routes, Route } from 'react-router-dom';
import Layout from '@/Layout';
import Dashboard from '@/Pages/Dashboard';
import IOCs from '@/Pages/IOCs';
import Sources from '@/Pages/Sources';
import Export from '@/Pages/Export';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/iocs" element={<Layout><IOCs /></Layout>} />
      <Route path="/sources" element={<Layout><Sources /></Layout>} />
      <Route path="/export" element={<Layout><Export /></Layout>} />
    </Routes>
  );
}

export default App;
