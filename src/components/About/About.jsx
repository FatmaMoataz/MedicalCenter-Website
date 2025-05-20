import about2 from '../../assets/images/about2.png';
import { Helmet } from 'react-helmet';


export default function About() {
  return (
    <>
    <Helmet>
<title>About Us</title>
    </Helmet>
    <div className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
          <div className="lg:w-1/2 md:w-10/12">
            <div className="mb-12">
              <div className="mb-8">
                <span className="text-blue-600 text-2xl uppercase font-medium">About Our Company</span>
                <h2 className="text-4xl font-bold text-gray-800">Welcome To Our Hospital</h2>
              </div>
              <p className="text-gray-600 mb-6">
                There are many variations of passages of lorem ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 md:w-full flex justify-center lg:justify-end">
            <img src={about2} alt="About" className="rounded-xl shadow-lg max-w-full" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
