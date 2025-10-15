import Details from "./Details";
import Faq from "./Faq";
import Hero from "./Hero";
import Hiw from "./Hiw";
import Services from "./Services";



export default function Home() {
  return (
    <div>
      <Hero />
      <Hiw />
      <Services />
      <Details />
      <Faq />
    </div>
  );
}
