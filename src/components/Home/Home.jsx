import Slider from 'react-slick';
import blog1 from '../../assets/images/blog1.png';
import blog2 from '../../assets/images/blog2.png';
import blog3 from '../../assets/images/blog3.png';
import About from '../About/About';
import Department from '../Department/Department';
import Doctor from '../Doctor/Doctor';

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  return (
    <>
    <div className="mx-auto py-7">
      <h1 className='font-medium text-4xl text-center mb-5'>WE CARE ABOUT YOUR <span className='text-blue-700'>HEALTH</span></h1>
      <Slider {...settings}>
        <div>
          <img src={blog1} alt="Blog 1" className="block w-96 h-96 mx-auto object-cover rounded-lg" />
        </div>
        <div>
          <img src={blog2} alt="Blog 2" className="block w-96 h-96 mx-auto object-cover rounded-lg" />
        </div>
        <div>
          <img src={blog3} alt="Blog 3" className="block w-96 h-96 mx-auto object-cover rounded-lg" />
        </div>
      </Slider>     
    </div>
    <About/>
    <Department/>
    <Doctor/>
    </>
  );
}
