import Navbar from "@components/ui/Navbar";
import { useAuth } from "@firebase/useAuth";
import "./Page.scss";


const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className='page-body'>
        <h1>Welcome to Unlinked Games</h1>
        <p>This is the homepage of our mobile games website.</p>

        {user && (
          <p>
            You are logged in as <strong>{user.displayName}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;