import './Background.css';
import video1 from '../../assets/SK1.mp4';

const Background = ({ playStatus }) => {
  return (
    <video className="background-video" autoPlay loop muted>
      <source src={video1} type="video/mp4" />
    </video>
  );
};

export default Background;
