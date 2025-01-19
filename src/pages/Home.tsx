import Navbar from "@components/ui/Navbar";
import { useAuth } from "@firebase/useAuth";


const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="page-body">
        <h1>Welcome to Fruits & Squares</h1>
        <p>This is the homepage of our games website.</p>

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