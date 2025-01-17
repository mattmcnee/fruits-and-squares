import Navbar from "@components/ui/Navbar";
import "./Page.scss";
const Home = () => {

  return (
    <div>
      <Navbar />
      <div className='page-body'>
        <h1>Welcome to Unlinked Games</h1>
        <p>This is the homepage of our mobile games website.</p>
      </div>
    </div>
  );
};

export default Home;