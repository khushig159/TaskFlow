import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/boards', { withCredentials: true });
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/boards', { title: newBoardTitle }, { withCredentials: true });
      setBoards([...boards, res.data]);
      setNewBoardTitle('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.welcome}>Welcome, {user?.name}!</h1>
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* Create Board */}
        <div className={styles.createSection}>
          <h3 className={styles.createTitle}>Create a New Board</h3>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="e.g., Website Launch, Personal Goals..."
              value={newBoardTitle}
              onChange={e => setNewBoardTitle(e.target.value)}
              className={styles.input}
            />
            <button onClick={createBoard} className={styles.createBtn}>
              Create Board
            </button>
          </div>
        </div>

        {/* Boards Grid */}
        <div className={styles.boardsGrid}>
          {boards.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No boards yet. Create your first one above!</p>
            </div>
          ) : (
            boards.map(board => (
              <div
                key={board._id}
                onClick={() => navigate(`/board/${board._id}`)}
                className={styles.boardCard}
              >
                {board.title}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}